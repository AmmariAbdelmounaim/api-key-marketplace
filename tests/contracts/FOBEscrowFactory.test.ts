import { expect } from "chai";
import { ethers } from "hardhat";

describe("FOBEscrowFactory Unit Tests", function () {
  let factory: any;
  let buyer: any, seller: any, carrier: any, other: any;

  beforeEach(async function () {
    // Retrieve signers for testing.
    [buyer, seller, carrier, other] = await ethers.getSigners();

    // Deploy the FOBEscrowFactory contract.
    const FOBEscrowFactory = await ethers.getContractFactory("FOBEscrowFactory");
    factory = await FOBEscrowFactory.deploy();
    await factory.waitForDeployment();
  });

  it("should create an escrow correctly when provided valid parameters", async function () {
    // Define the deposit amount (1 ETH).
    const deposit = ethers.parseEther("1.0");

    // Buyer calls createEscrow with valid seller and carrier addresses.
    const tx = await factory.connect(buyer).createEscrow(seller.address, carrier.address, {
      value: deposit,
    });
    const receipt = await tx.wait();

    // Updated event handling
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed?.name === "EscrowCreated";
      } catch {
        return false;
      }
    });

    // Parse the event data
    const parsedEvent = factory.interface.parseLog(event);
    
    expect(parsedEvent, "Missing EscrowCreated event").to.not.be.undefined;
    expect(parsedEvent.args.buyer).to.equal(buyer.address);
    expect(parsedEvent.args.seller).to.equal(seller.address);
    expect(parsedEvent.args.carrier).to.equal(carrier.address);
    expect(parsedEvent.args.amount).to.equal(deposit);

    // Verify that the escrow address stored in the factory matches the address from the event.
    const escrowAddress = parsedEvent.args.escrowAddress;
    const storedEscrowAddress = await factory.escrows(0);
    expect(storedEscrowAddress).to.equal(escrowAddress);

    // Instantiate the deployed FOBEscrow contract.
    const escrow = await ethers.getContractAt("FOBEscrow", escrowAddress);

    // Verify that the escrow's constructor correctly set the state.
    expect(await escrow.buyer()).to.equal(buyer.address);
    expect(await escrow.seller()).to.equal(seller.address);
    expect(await escrow.carrier()).to.equal(carrier.address);
    expect(await escrow.amount()).to.equal(deposit);

    // Check the initial state of the escrow.
    // State.Created corresponds to enum value 0.
    expect(await escrow.currentState()).to.equal(0);

    // Verify using the getContractState function.
    const [state, exportHash, bolHash, contractAmount] = await escrow.getContractState();
    expect(state).to.equal(0); // 0 -> State.Created
    expect(exportHash).to.equal(ethers.ZeroHash);
    expect(bolHash).to.equal(ethers.ZeroHash);
    expect(contractAmount).to.equal(deposit);
  });

  it("should revert if the buyer is the same as the seller", async function () {
    const deposit = ethers.parseEther("1.0");

    // Buyer passes its own address as the seller.
    await expect(
      factory.connect(buyer).createEscrow(buyer.address, carrier.address, { value: deposit })
    ).to.be.revertedWith("Buyer and seller cannot be the same address");
  });

  it("should revert if the buyer is the same as the carrier", async function () {
    const deposit = ethers.parseEther("1.0");

    // Buyer passes its own address as the carrier.
    await expect(
      factory.connect(buyer).createEscrow(seller.address, buyer.address, { value: deposit })
    ).to.be.revertedWith("Buyer and carrier cannot be the same address");
  });

  it("should revert if the seller and carrier are the same address", async function () {
    const deposit = ethers.parseEther("1.0");

    // Seller and carrier addresses are identical.
    await expect(
      factory.connect(buyer).createEscrow(seller.address, seller.address, { value: deposit })
    ).to.be.revertedWith("Seller and carrier cannot be the same address");
  });
});

describe("FOBEscrowFactory Integration", function () {
  let factory: any;
  let buyer: any, seller: any, carrier: any, other: any;
  let FOBEscrow: any;

  beforeEach(async function () {
    [buyer, seller, carrier, other] = await ethers.getSigners();
    
    // Deploy the factory contract
    const FOBEscrowFactory = await ethers.getContractFactory("FOBEscrowFactory");
    factory = await FOBEscrowFactory.deploy();
    await factory.waitForDeployment();

    // Get the FOBEscrow contract factory for verification
    FOBEscrow = await ethers.getContractFactory("FOBEscrow");
  });

  describe("Integration with FOBEscrow", function () {
    it("should allow full escrow workflow through factory created contract", async function () {
      const deposit = ethers.parseEther("1.0");
      const declarationHash = ethers.id("exportDeclaration123");
      const billOfLadingHash = ethers.id("billOfLading123");

      // 1. Create escrow through factory
      const tx = await factory.connect(buyer).createEscrow(seller.address, carrier.address, {
        value: deposit,
      });
      const receipt = await tx.wait();

      // Get the escrow address from the event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed?.name === "EscrowCreated";
        } catch {
          return false;
        }
      });
      const parsedEvent = factory.interface.parseLog(event);
      const escrowAddress = parsedEvent.args.escrowAddress;

      // 2. Get the deployed escrow contract instance
      const escrow = FOBEscrow.attach(escrowAddress);

      // 3. Verify initial state
      expect(await escrow.buyer()).to.equal(buyer.address);
      expect(await escrow.seller()).to.equal(seller.address);
      expect(await escrow.carrier()).to.equal(carrier.address);
      expect(await escrow.amount()).to.equal(deposit);
      expect(await escrow.currentState()).to.equal(0); // Created

      // 4. Execute full workflow
      // Seller confirms export clearance
      await expect(escrow.connect(seller).confirmExportClearance(declarationHash))
        .to.emit(escrow, "ExportCleared")
        .withArgs(seller.address, declarationHash);
      expect(await escrow.currentState()).to.equal(1); // ExportCleared

      // Carrier confirms loading
      await expect(escrow.connect(carrier).confirmLoadedOnBoard(billOfLadingHash))
        .to.emit(escrow, "CargoLoaded")
        .withArgs(carrier.address, billOfLadingHash);
      expect(await escrow.currentState()).to.equal(2); // LoadedOnBoard

      // Check seller's initial balance
      const initialSellerBalance = await ethers.provider.getBalance(seller.address);

      // Buyer releases payment
      await expect(escrow.connect(buyer).releasePayment())
        .to.emit(escrow, "PaymentReleased")
        .withArgs(seller.address, deposit);
      expect(await escrow.currentState()).to.equal(3); // Completed

      // Verify seller received payment
      const finalSellerBalance = await ethers.provider.getBalance(seller.address);
      expect(finalSellerBalance - initialSellerBalance).to.equal(deposit);
    });

    it("should track all created escrows correctly", async function () {
      const deposit = ethers.parseEther("1.0");

      // Create multiple escrows
      for (let i = 0; i < 3; i++) {
        await factory.connect(buyer).createEscrow(seller.address, carrier.address, {
          value: deposit,
        });
      }

      // Verify escrow count
      const firstEscrowAddress = await factory.escrows(0);
      const secondEscrowAddress = await factory.escrows(1);
      const thirdEscrowAddress = await factory.escrows(2);

      // Verify each escrow is unique
      expect(firstEscrowAddress).to.not.equal(secondEscrowAddress);
      expect(secondEscrowAddress).to.not.equal(thirdEscrowAddress);
      expect(firstEscrowAddress).to.not.equal(thirdEscrowAddress);

      // Verify each escrow is properly initialized
      for (let i = 0; i < 3; i++) {
        const escrowAddress = await factory.escrows(i);
        const escrow = FOBEscrow.attach(escrowAddress);
        expect(await escrow.buyer()).to.equal(buyer.address);
        expect(await escrow.seller()).to.equal(seller.address);
        expect(await escrow.carrier()).to.equal(carrier.address);
        expect(await escrow.amount()).to.equal(deposit);
      }
    });

    it("should handle multiple buyers creating escrows simultaneously", async function () {
      const deposit = ethers.parseEther("1.0");
      const [buyer1, buyer2] = [buyer, other];
      
      // Create and fund a new random signer
      const randomWallet = ethers.Wallet.createRandom();
      const buyer3 = await ethers.getImpersonatedSigner(randomWallet.address);
      
      // Fund the impersonated signer with enough ETH for the transaction
      await ethers.provider.send("hardhat_setBalance", [
        buyer3.address,
        ethers.toBeHex(ethers.parseEther("10.0")) // Fund with 10 ETH
      ]);

      // Create escrows from different buyers
      await factory.connect(buyer1).createEscrow(seller.address, carrier.address, { value: deposit });
      await factory.connect(buyer2).createEscrow(seller.address, carrier.address, { value: deposit });
      await factory.connect(buyer3).createEscrow(seller.address, carrier.address, { value: deposit });

      // Verify each escrow has the correct buyer
      const escrow1 = FOBEscrow.attach(await factory.escrows(0));
      const escrow2 = FOBEscrow.attach(await factory.escrows(1));
      const escrow3 = FOBEscrow.attach(await factory.escrows(2));

      expect(await escrow1.buyer()).to.equal(buyer1.address);
      expect(await escrow2.buyer()).to.equal(buyer2.address);
      expect(await escrow3.buyer()).to.equal(buyer3.address);
    });
  });
}); 