// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DataStructures {
    // Enum
    enum Role { ADMIN, SUPPLIER, MANUFACTURER, DISTRIBUTOR }

    // Structs
    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
    }

    struct ClientOrder {
        uint256 id;
        uint256 orderId;
        string clientName;
        string clientAddress;
        uint256 clientProductQuantity;
        uint256 shouldArriveToClientAt;
        bool isShippedToClient;
        uint256 shippedToClientAt;
        bool isArrivedToClient;
        uint256 deliveredToClientAt;
    }

    struct Order {
        uint256 id;
        address manufacturerAddress;
        bool isProduced;
        uint256 producedAt;
        bool isShippedToDistributor;
        uint256 shippedToDistributorAt;
        address distributorAddress;
        bool isArrivedToDistributor;
        uint256 arrivedToDistributorAt;
        string productName;
        uint256 productQuantity;
        uint256 productHash;
        string orderStatus;
    }


    struct ClientOrderWithOrder {
        ClientOrder clientOrder;
        Order order;
    }

    struct DistributorDetails {
        string name;
        string place;
        string emailAddress;
        bool isDeleted;
    }

    struct ManufacturerDetails {
        string name;
        string email;
        string place;
        bool isDeleted;
    }

    struct SupplierDetails {
        string name;
        uint256 reliabilityRating;
        string isFraud;
        string place;
        string emailAddress;
        string[] violations;
        bool isDeleted;
    }

    struct RawMaterial {
        uint256 id;
        address supplierAddress;
        string name;
        string description;
        uint256 price;
        uint256 quantityAvailable;
        uint256 reviewPriceUpdate;
        bool isAvailable;
        uint256 timestamp;
        string updatePriceRaison;
        uint256[] priceUpdateTimestamps;
        string reviewReason;
        bool isDeleted;
    }

    struct RawMaterialWithSupplier {
        RawMaterial material;
        SupplierDetails supplier;
    }

    struct OrderRawMaterial {
        uint id;
        address supplierAddress;
        address manufacturerAddress;
        string materialName;
        string materialId;
        uint256 quantityOrdered;
        uint256 quantityreceived;
        uint256 price;
        uint256 shippedAt;
        uint256 shouldArriveAt;
        uint256 arrivedAt;
        string status; // Shipped, Delivered, Canceled
    }

    // Mappings
    mapping(address => User) public users;

    mapping(address => DistributorDetails) public distributors;
    mapping(address => ManufacturerDetails) public manufacturers;
    mapping(address => SupplierDetails) public suppliers;
    mapping(uint256 => RawMaterial) public materials;
    mapping(address => uint256[]) public supplierToMaterials;
    mapping(address => uint[]) public manufacturerOrders;

    mapping(uint256 => Order) public orders;
    mapping(uint256 => ClientOrder[]) public clientOrders;
    mapping(uint256 => ClientOrder) public clientOrderById;
    mapping(uint => OrderRawMaterial) public rawMaterailOrders;

    // State Variables
    uint256 public transactionCount;
    address public admin;
    bool public adminCreated = false;

    // Arrays
    uint256[] public orderIds;
    address[] public distributorAddresses;
    address[] public manufacturerAddresses;
    address[] public supplierAddresses;

    // Counters
    uint256 public orderCounter = 0;
    uint256 public clientOrderCounter = 0;
    uint public orderRawMaterialCounter;
    uint256 public materialIdCounter = 0;

    // Constants
    string constant HIGHER_PRICE = "HIGHER_PRICE";
    string constant FREQUENT_UPDATES = "FREQUENT_UPDATES";
    uint256 constant SIX_MONTHS = 180 days;
    uint256 constant MAX_PRICE_UPDATES = 2;

    // Getter for users mapping
    function getUser(address userAddress) public view returns (User memory) {
        return users[userAddress];
    }

    // Getter for orders mapping
    function getOrder(uint256 orderId) public view returns (Order memory) {
        return orders[orderId];
    }

    // Getter for clientOrders mapping
    function getClientOrders(uint256 orderId) public view returns (ClientOrder[] memory) {
        return clientOrders[orderId];
    }

    // Getter for clientOrderById mapping
    function getClientOrderById(uint256 clientOrderId) public view returns (ClientOrder memory) {
        return clientOrderById[clientOrderId];
    }

    // Getter for distributors mapping
    function getDistributor(address distributorAddress) public view returns (DistributorDetails memory) {
        return distributors[distributorAddress];
    }

    // Getter for manufacturers mapping
    function getManufacturer(address manufacturerAddress) public view returns (ManufacturerDetails memory) {
        return manufacturers[manufacturerAddress];
    }

    // Getter for suppliers mapping
    function getSupplier(address supplierAddress) public view returns (SupplierDetails memory) {
        return suppliers[supplierAddress];
    }

    // Getter for materials mapping
    function getMaterial(uint256 materialId) public view returns (RawMaterial memory) {
        return materials[materialId];
    }

    // Getter for supplierToMaterials mapping
    function getSupplierMaterials(address supplierAddress) public view returns (uint256[] memory) {
        return supplierToMaterials[supplierAddress];
    }

    // Getter for rawMaterailOrders mapping
    function getRawMaterialOrder(uint orderId) public view returns (OrderRawMaterial memory) {
        return rawMaterailOrders[orderId];
    }

    // Getter for manufacturerOrders mapping
    function getManufacturerOrders(address manufacturerAddress) public view returns (uint[] memory) {
        return manufacturerOrders[manufacturerAddress];
    }

    // Getter for transactionCount
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    // Getter for admin
    function getAdmin() public view returns (address) {
        return admin;
    }

    // Getter for adminCreated
    function getAdminCreated() public view returns (bool) {
        return adminCreated;
    }

    // Getter for orderIds array
    function getOrderIds() public view returns (uint256[] memory) {
        return orderIds;
    }

    // Getter for distributorAddresses array
    function getDistributorAddresses() public view returns (address[] memory) {
        return distributorAddresses;
    }

    // Getter for manufacturerAddresses array
    function getManufacturerAddresses() public view returns (address[] memory) {
        return manufacturerAddresses;
    }

    // Getter for supplierAddresses array
    function getSupplierAddresses() public view returns (address[] memory) {
        return supplierAddresses;
    }

    // Getter for orderCounter
    function getOrderCounter() public view returns (uint256) {
        return orderCounter;
    }

    // Getter for clientOrderCounter
    function getClientOrderCounter() public view returns (uint256) {
        return clientOrderCounter;
    }

    // Getter for orderRawMaterialCounter
    function getOrderRawMaterialCounter() public view returns (uint256) {
        return orderRawMaterialCounter;
    }

    // Getter for materialIdCounter
    function getMaterialIdCounter() public view returns (uint256) {
        return materialIdCounter;
    }

    // Getter functions for constants
    function getHigherPrice() public pure returns (string memory) {
        return HIGHER_PRICE;
    }

    function getFrequentUpdates() public pure returns (string memory) {
        return FREQUENT_UPDATES;
    }

    function getSixMonths() public pure returns (uint256) {
        return SIX_MONTHS;
    }

    function getMaxPriceUpdates() public pure returns (uint256) {
        return MAX_PRICE_UPDATES;
    }
    
    // // Events
    event OrderCreated(uint256 indexed id, address indexed manufacturerAddress, address indexed distributorAddress, string productName);
    event ClientOrderAdded(uint256 indexed clientOrderId, uint256 indexed orderId, string clientName);
    event OrderDelivered(uint256 orderId, string clientName, uint256 timestamp);
    event OrderShipped(uint256 orderId, uint256 productHash);
    event MaterialAdded(uint256 indexed id, address indexed supplier);
    event MaterialUpdated(uint256 indexed id);
    event PriceUpdateRequested(uint256 indexed id, uint256 oldPrice, uint256 newPrice, string reason);
    event PriceUpdateApproved(uint256 indexed id, uint256 newPrice);
    event PriceUpdateRejected(uint256 indexed id);
    event RawMaterialOrderCreated(uint orderId, address manufacturer, address supplier);
    event RawMaterialOrderShipped(uint orderId, uint256 shippedAt);
    event RawMaterialOrderDelivered(uint orderId);
    event PriceUpdateConfirmed(uint256 indexed materialId, bool approved);
    event SupplierFraudStatusUpdated(address indexed supplier, bool isFraud, uint256 newReliabilityRating);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier onlyDistributor() {
        require(users[msg.sender].role == Role.DISTRIBUTOR, "Only distributor can perform this action");
        _;
    }

    modifier onlyManufacturer() {
        require(users[msg.sender].role == Role.MANUFACTURER, "Only manufacturer can perform this action");
        _;
    }

    modifier onlySupplier() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == Role.SUPPLIER, "Only suppliers can perform this action");
        _;
    }
}