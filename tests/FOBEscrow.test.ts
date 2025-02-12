import { expect } from "chai";
import { ethers } from "hardhat";

describe("FOBEscrow Unit Tests", function () {
  let escrow: any;
  let buyer: any, seller: any, carrier: any, other: any;
  const deposit = ethers.parseEther("1.0");

  describe("Constructor", function () {
    beforeEach(async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
    });

    it("should deploy with correct initial state", async function () {
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      escrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await escrow.waitForDeployment();

      // Verify that the constructor correctly sets the state
      expect(await escrow.buyer()).to.equal(buyer.address);
      expect(await escrow.seller()).to.equal(seller.address);
      expect(await escrow.carrier()).to.equal(carrier.address);
      expect(await escrow.amount()).to.equal(deposit);
      expect(await escrow.currentState()).to.equal(0); // 0 => Created

      const [state, exportHash, bolHash, contractAmount] = await escrow.getContractState();
      expect(state).to.equal(0);
      expect(exportHash).to.equal(ethers.ZeroHash);
      expect(bolHash).to.equal(ethers.ZeroHash);
      expect(contractAmount).to.equal(deposit);
    });

    it("should revert if deployed with zero deposit", async function () {
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      await expect(
        FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: 0 })
      ).to.be.revertedWith("Payment amount required");
    });

    it("should revert if any party address is the zero address", async function () {
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      await expect(
        FOBEscrow.deploy(ethers.ZeroAddress, buyer.address, carrier.address, { value: deposit })
      ).to.be.revertedWith("Invalid addresses");
    });
  });

  describe("confirmExportClearance", function () {
    const validDeclarationHash =
      "0x123456789012345678901234567890123456789012345678901234567890abcd";

    beforeEach(async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      escrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await escrow.waitForDeployment();
    });

    it("should allow seller to confirm export clearance", async function () {
      await expect(escrow.connect(seller).confirmExportClearance(validDeclarationHash))
        .to.emit(escrow, "ExportCleared")
        .withArgs(seller.address, validDeclarationHash);

      expect(await escrow.currentState()).to.equal(1); // 1 => ExportCleared
      expect(await escrow.exportDeclarationHash()).to.equal(validDeclarationHash);
    });

    it("should revert if a non-seller tries to confirm export clearance", async function () {
      await expect(
        escrow.connect(buyer).confirmExportClearance(validDeclarationHash)
      ).to.be.revertedWith("Only seller can confirm export clearance");
    });

    it("should revert if confirmation is attempted with a zero hash", async function () {
      await expect(
        escrow.connect(seller).confirmExportClearance(ethers.ZeroHash)
      ).to.be.revertedWith("Invalid hash");
    });

    it("should revert if confirmExportClearance is called in an incorrect state", async function () {
      // First, confirm clearance so the state is no longer Created.
      await escrow.connect(seller).confirmExportClearance(validDeclarationHash);
      // A second call should revert because state is not Created anymore.
      await expect(
        escrow.connect(seller).confirmExportClearance(validDeclarationHash)
      ).to.be.revertedWith("Invalid state");
    });
  });

  describe("confirmLoadedOnBoard", function () {
    const validDeclarationHash =
      "0x123456789012345678901234567890123456789012345678901234567890abcd";
    const validBillOfLadingHash =
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    beforeEach(async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      escrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await escrow.waitForDeployment();

      // Transition to ExportCleared state.
      await escrow.connect(seller).confirmExportClearance(validDeclarationHash);
    });

    it("should allow carrier to confirm loaded on board", async function () {
      await expect(escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash))
        .to.emit(escrow, "CargoLoaded")
        .withArgs(carrier.address, validBillOfLadingHash);

      expect(await escrow.currentState()).to.equal(2); // 2 => LoadedOnBoard
      expect(await escrow.billOfLadingHash()).to.equal(validBillOfLadingHash);
    });

    it("should revert if a non-carrier calls confirmLoadedOnBoard", async function () {
      await expect(
        escrow.connect(buyer).confirmLoadedOnBoard(validBillOfLadingHash)
      ).to.be.revertedWith("Only carrier can confirm loading");
    });

    it("should revert if bill of lading hash is zero", async function () {
      await expect(
        escrow.connect(carrier).confirmLoadedOnBoard(ethers.ZeroHash)
      ).to.be.revertedWith("Invalid hash");
    });

    it("should revert if confirmLoadedOnBoard is called when state is not ExportCleared", async function () {
      // After carrier confirms, state becomes LoadedOnBoard.
      await escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash);
      await expect(
        escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash)
      ).to.be.revertedWith("Export not cleared");
    });
  });

  describe("releasePayment", function () {
    const validDeclarationHash =
      "0x123456789012345678901234567890123456789012345678901234567890abcd";
    const validBillOfLadingHash =
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    beforeEach(async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      escrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await escrow.waitForDeployment();

      // Transition the contract to the LoadedOnBoard state.
      await escrow.connect(seller).confirmExportClearance(validDeclarationHash);
      await escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash);
    });

    it("should allow buyer to release payment and transfer funds to seller", async function () {
      // Capture seller's balance before payment release.
      const initialSellerBalance = await ethers.provider.getBalance(seller.address);
      const tx = await escrow.connect(buyer).releasePayment();
      await tx.wait();

      expect(await escrow.currentState()).to.equal(3); // 3 => Completed

      await expect(tx)
        .to.emit(escrow, "PaymentReleased")
        .withArgs(seller.address, deposit);

      const finalSellerBalance = await ethers.provider.getBalance(seller.address);
      expect(finalSellerBalance).to.be.gt(initialSellerBalance);
    });

    it("should allow seller to release payment", async function () {
      const tx = await escrow.connect(seller).releasePayment();
      await tx.wait();
      expect(await escrow.currentState()).to.equal(3); // Completed
    });

    it("should revert if an unauthorized address attempts to release payment", async function () {
      await expect(escrow.connect(carrier).releasePayment()).to.be.revertedWith("Unauthorized");
    });

    it("should revert if releasePayment is called in an invalid state", async function () {
      // Deploy a fresh escrow that is still in the Created state.
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      const newEscrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await newEscrow.waitForDeployment();

      await expect(newEscrow.connect(buyer).releasePayment()).to.be.revertedWith("Cargo not loaded");
    });
  });

  describe("refundBuyer", function () {
    const validDeclarationHash =
      "0x123456789012345678901234567890123456789012345678901234567890abcd";

    it("should allow buyer to refund when the state is Created", async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      const newEscrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await newEscrow.waitForDeployment();

      const initialBuyerBalance = await ethers.provider.getBalance(buyer.address);
      const tx = await newEscrow.connect(buyer).refundBuyer();
      await tx.wait();

      expect(await newEscrow.currentState()).to.equal(4); // 4 => Refunded

      await expect(tx)
        .to.emit(newEscrow, "RefundIssued")
        .withArgs(buyer.address, deposit);

      const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);
      // The buyer's balance should reflect the refund (ignoring gas costs)
      expect(finalBuyerBalance).to.be.gt(initialBuyerBalance - deposit);
    });

    it("should allow buyer to refund when the state is ExportCleared", async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      const newEscrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await newEscrow.waitForDeployment();

      await newEscrow.connect(seller).confirmExportClearance(validDeclarationHash);
      const tx = await newEscrow.connect(buyer).refundBuyer();
      await tx.wait();

      expect(await newEscrow.currentState()).to.equal(4); // Refunded
    });

    it("should revert if a non-buyer attempts a refund", async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      const newEscrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await newEscrow.waitForDeployment();

      await expect(newEscrow.connect(seller).refundBuyer()).to.be.revertedWith("Only buyer can refund");
    });

    it("should revert if refund is attempted when the state is invalid", async function () {
      [buyer, seller, carrier, other] = await ethers.getSigners();
      const FOBEscrow = await ethers.getContractFactory("FOBEscrow");
      const newEscrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
      await newEscrow.waitForDeployment();

      await newEscrow.connect(seller).confirmExportClearance(validDeclarationHash);
      const validBillOfLadingHash =
        "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";
      await newEscrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash);

      await expect(newEscrow.connect(buyer).refundBuyer()).to.be.revertedWith("Too late for refund");
    });
  });
}); 

describe("FOBEscrow Integration", function () {
  let escrow: any;
  let FOBEscrow: any;
  let buyer: any, seller: any, carrier: any, other: any;
  const deposit = ethers.parseEther("1.0");
  const validDeclarationHash = ethers.id("exportDeclaration123");
  const validBillOfLadingHash = ethers.id("billOfLading123");

  beforeEach(async function () {
    [buyer, seller, carrier, other] = await ethers.getSigners();
    
    // Deploy a new escrow contract for each test
    FOBEscrow = await ethers.getContractFactory("FOBEscrow");
    escrow = await FOBEscrow.deploy(seller.address, buyer.address, carrier.address, { value: deposit });
    await escrow.waitForDeployment();
  });

  describe("Complete Workflow Integration", function () {
    it("should execute a successful FOB transaction workflow", async function () {
      // Initial state verification
      expect(await escrow.currentState()).to.equal(0); // Created
      expect(await escrow.amount()).to.equal(deposit);

      // 1. Seller confirms export clearance
      await expect(escrow.connect(seller).confirmExportClearance(validDeclarationHash))
        .to.emit(escrow, "ExportCleared")
        .withArgs(seller.address, validDeclarationHash);
      
      expect(await escrow.currentState()).to.equal(1); // ExportCleared
      expect(await escrow.exportDeclarationHash()).to.equal(validDeclarationHash);

      // 2. Carrier confirms cargo loaded
      await expect(escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash))
        .to.emit(escrow, "CargoLoaded")
        .withArgs(carrier.address, validBillOfLadingHash);
      
      expect(await escrow.currentState()).to.equal(2); // LoadedOnBoard
      expect(await escrow.billOfLadingHash()).to.equal(validBillOfLadingHash);

      // 3. Record seller's balance before payment
      const initialSellerBalance = await ethers.provider.getBalance(seller.address);

      // 4. Buyer releases payment
      await expect(escrow.connect(buyer).releasePayment())
        .to.emit(escrow, "PaymentReleased")
        .withArgs(seller.address, deposit);
      
      expect(await escrow.currentState()).to.equal(3); // Completed

      // 5. Verify seller received payment
      const finalSellerBalance = await ethers.provider.getBalance(seller.address);
      expect(finalSellerBalance - initialSellerBalance).to.equal(deposit);
    });

    it("should handle refund workflow correctly", async function () {
      // Initial state
      expect(await escrow.currentState()).to.equal(0); // Created

      // Record buyer's balance before refund
      const initialBuyerBalance = await ethers.provider.getBalance(buyer.address);

      // Buyer requests refund
      const refundTx = await escrow.connect(buyer).refundBuyer();
      const receipt = await refundTx.wait();
      
      // Calculate gas costs
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      expect(await escrow.currentState()).to.equal(4); // Refunded

      // Verify buyer received refund (accounting for gas costs)
      const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);
      
      // Use BigInt for precise calculations
      expect(
        finalBuyerBalance + BigInt(gasUsed) - initialBuyerBalance
      ).to.equal(deposit);
    });
  });

  describe("Multi-Party Integration", function () {
    it("should handle multiple parties interacting with the contract", async function () {
      // Create and fund additional parties
      const additionalBuyer = await ethers.getImpersonatedSigner(ethers.Wallet.createRandom().address);
      const additionalSeller = await ethers.getImpersonatedSigner(ethers.Wallet.createRandom().address);
      
      await ethers.provider.send("hardhat_setBalance", [
        additionalBuyer.address,
        ethers.toBeHex(ethers.parseEther("10.0"))
      ]);
      await ethers.provider.send("hardhat_setBalance", [
        additionalSeller.address,
        ethers.toBeHex(ethers.parseEther("10.0"))
      ]);

      // First, verify unauthorized seller cannot confirm export
      await expect(
        escrow.connect(additionalSeller).confirmExportClearance(validDeclarationHash)
      ).to.be.revertedWith("Only seller can confirm export clearance");

      // Progress the state to LoadedOnBoard
      await escrow.connect(seller).confirmExportClearance(validDeclarationHash);
      await escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash);

      // Now verify unauthorized buyer cannot release payment
      await expect(
        escrow.connect(additionalBuyer).releasePayment()
      ).to.be.revertedWith("Unauthorized");

      // Complete the workflow with authorized buyer
      await escrow.connect(buyer).releasePayment();
      expect(await escrow.currentState()).to.equal(3); // Completed
    });
  });

  describe("State Transition Integration", function () {
    it("should enforce correct state transitions", async function () {
      // Try to load cargo before export clearance
      await expect(
        escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash)
      ).to.be.revertedWith("Export not cleared");

      // Try to release payment before cargo is loaded
      await expect(
        escrow.connect(buyer).releasePayment()
      ).to.be.revertedWith("Cargo not loaded");

      // Correct order of operations
      await escrow.connect(seller).confirmExportClearance(validDeclarationHash);
      expect(await escrow.currentState()).to.equal(1); // ExportCleared

      await escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash);
      expect(await escrow.currentState()).to.equal(2); // LoadedOnBoard

      // Try to refund after cargo is loaded (should fail)
      await expect(
        escrow.connect(buyer).refundBuyer()
      ).to.be.revertedWith("Too late for refund");

      await escrow.connect(buyer).releasePayment();
      expect(await escrow.currentState()).to.equal(3); // Completed

      // Verify no further state changes are possible
      await expect(
        escrow.connect(seller).confirmExportClearance(validDeclarationHash)
      ).to.be.revertedWith("Invalid state");
    });
  });

  describe("Contract State Verification", function () {
    it("should maintain accurate contract state throughout the workflow", async function () {
      // Check initial state
      let [state, exportHash, bolHash, contractAmount] = await escrow.getContractState();
      expect(state).to.equal(0); // Created
      expect(exportHash).to.equal(ethers.ZeroHash);
      expect(bolHash).to.equal(ethers.ZeroHash);
      expect(contractAmount).to.equal(deposit);

      // After export clearance
      await escrow.connect(seller).confirmExportClearance(validDeclarationHash);
      [state, exportHash, bolHash, contractAmount] = await escrow.getContractState();
      expect(state).to.equal(1); // ExportCleared
      expect(exportHash).to.equal(validDeclarationHash);
      expect(bolHash).to.equal(ethers.ZeroHash);

      // After cargo loaded
      await escrow.connect(carrier).confirmLoadedOnBoard(validBillOfLadingHash);
      [state, exportHash, bolHash, contractAmount] = await escrow.getContractState();
      expect(state).to.equal(2); // LoadedOnBoard
      expect(exportHash).to.equal(validDeclarationHash);
      expect(bolHash).to.equal(validBillOfLadingHash);

      // After payment release
      await escrow.connect(buyer).releasePayment();
      [state, exportHash, bolHash, contractAmount] = await escrow.getContractState();
      expect(state).to.equal(3); // Completed
      expect(exportHash).to.equal(validDeclarationHash);
      expect(bolHash).to.equal(validBillOfLadingHash);
    });
  });
});