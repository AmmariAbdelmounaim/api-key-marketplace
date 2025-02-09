// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FOBEscrow {
    // Parties impliquées dans la transaction
    address public buyer;
    address public seller;
    address public carrier;
    uint public amount;
    
    // États possibles du contrat
    enum State { 
        Created,        // Contrat créé, fonds déposés
        ExportCleared,  // Déclaration d'export validée
        LoadedOnBoard,  // Marchandise chargée sur le navire
        Completed,      // Transaction terminée, paiement effectué
        Refunded       // Fonds remboursés à l'acheteur
    }
    
    // État actuel du contrat
    State public currentState;
    
    // Hashes des documents
    bytes32 public billOfLadingHash;
    bytes32 public exportDeclarationHash;
    
    // Événements pour suivre les étapes importantes
    event ExportCleared(address indexed seller, bytes32 declarationHash);
    event CargoLoaded(address indexed carrier, bytes32 billOfLadingHash);
    event PaymentReleased(address indexed seller, uint amount);
    event ContractCreated(address indexed buyer, address indexed seller, uint amount);
    event RefundIssued(address indexed buyer, uint amount);
    
    // Constructeur : initialise le contrat avec les parties et le montant
    constructor(address _seller, address _buyer, address _carrier) payable {
        require(msg.value > 0, "Payment amount required");
        require(_seller != address(0) && _buyer != address(0) && _carrier != address(0), 
                "Invalid addresses");
        
        buyer = _buyer;
        seller = _seller;
        carrier = _carrier;
        amount = msg.value;
        currentState = State.Created;
        
        emit ContractCreated(buyer, seller, amount);
    }

    // Le vendeur confirme que l'export est validé
    function confirmExportClearance(bytes32 _declarationHash) public {
        require(msg.sender == seller, "Only seller can confirm export clearance");
        require(currentState == State.Created, "Invalid state");
        require(_declarationHash != bytes32(0), "Invalid hash");
        
        exportDeclarationHash = _declarationHash;
        currentState = State.ExportCleared;
        emit ExportCleared(seller, _declarationHash);
    }
    
    // Le transporteur confirme que la marchandise est chargée
    function confirmLoadedOnBoard(bytes32 _billOfLadingHash) public {
        require(msg.sender == carrier, "Only carrier can confirm loading");
        require(currentState == State.ExportCleared, "Export not cleared");
        require(_billOfLadingHash != bytes32(0), "Invalid hash");
        
        billOfLadingHash = _billOfLadingHash;
        currentState = State.LoadedOnBoard;
        emit CargoLoaded(carrier, _billOfLadingHash);
    }

    // Libération du paiement au vendeur
    function releasePayment() public {
        require(currentState == State.LoadedOnBoard, "Cargo not loaded");
        require(msg.sender == buyer || msg.sender == seller, "Unauthorized");
        
        currentState = State.Completed;
        payable(seller).transfer(amount);
        emit PaymentReleased(seller, amount);
    }

    // Remboursement à l'acheteur si nécessaire
    function refundBuyer() public {
        require(msg.sender == buyer, "Only buyer can refund");
        require(currentState == State.Created || currentState == State.ExportCleared, 
                "Too late for refund");
        
        currentState = State.Refunded;
        payable(buyer).transfer(amount);
        emit RefundIssued(buyer, amount);
    }

    // Fonction pour vérifier l'état actuel du contrat
    function getContractState() public view returns (
        State state,
        bytes32 exportHash,
        bytes32 bolHash,
        uint contractAmount
    ) {
        return (
            currentState,
            exportDeclarationHash,
            billOfLadingHash,
            amount
        );
    }
} 