// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Transactions {
    uint256 transactionCount;
    

    // admin creation
    address public admin;
    enum Role { ADMIN, SUPPLIER, MANUFACTURER, DISTRIBUTOR }

    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
    }

    mapping(address => User) public users;
    bool public adminCreated = false;

    constructor(address _adminAddress) {
        require(!adminCreated, "Admin already created");
        require(_adminAddress != address(0), "Invalid admin address");

        admin = _adminAddress;
        users[_adminAddress] = User({
            userAddress: _adminAddress,
            role: Role.ADMIN,
            isRegistered: true
        });
        adminCreated = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }


    // distributor
    struct DistributorDetails {
        string name;
        string place;
    }
    
    mapping(address => DistributorDetails) public distributors;
    address[] public distributorAddresses; // Pour suivre tous les distributeurs


    function createDistributor(
        address _distributorAddress,
        string memory _name,
        string memory _place
    ) public onlyAdmin {
        require(_distributorAddress != address(0), "Invalid address");
        require(!users[_distributorAddress].isRegistered, "User already exists");
        
        users[_distributorAddress] = User({
            userAddress: _distributorAddress,
            role: Role.DISTRIBUTOR,
            isRegistered: true
        });
        
        distributors[_distributorAddress] = DistributorDetails(_name, _place);
        distributorAddresses.push(_distributorAddress);
    }

    
    function getAllDistributors() public view returns (
        address[] memory,
        string[] memory,
        string[] memory
    ) {
        uint length = distributorAddresses.length;
        
        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        string[] memory places = new string[](length);
        
        for(uint i = 0; i < length; i++) {
            address distributorAddr = distributorAddresses[i];
            addresses[i] = distributorAddr;
            names[i] = distributors[distributorAddr].name;
            places[i] = distributors[distributorAddr].place;
        }
        
        return (addresses, names, places);
    }







    // manufacturer
    // struct ManufacturerDetails {
    //     string name;
    //     string certification;
    // }

    // mapping(address => ManufacturerDetails) public manufacturers;
    // address[] public manufacturerAddresses;


    // function createManufacturer(
    //     address _manufacturerAddress,
    //     string memory _name,
    //     string memory _certification
    // ) public onlyAdmin {
    //     require(_manufacturerAddress != address(0), "Invalid address");
    //     require(!users[_manufacturerAddress].isRegistered, "User already exists");
        
    //     users[_manufacturerAddress] = User({
    //         userAddress: _manufacturerAddress,
    //         role: Role.MANUFACTURER,
    //         isRegistered: true
    //     });
        
    //     manufacturers[_manufacturerAddress] = ManufacturerDetails(_name, _certification);
    //     manufacturerAddresses.push(_manufacturerAddress);
    // }


    // function getAllManufacturers() public view returns (
    //     address[] memory,
    //     string[] memory,
    //     string[] memory
    // ) {
    //     uint length = manufacturerAddresses.length;
        
    //     address[] memory addresses = new address[](length);
    //     string[] memory names = new string[](length);
    //     string[] memory certifications = new string[](length);
        
    //     for(uint i = 0; i < length; i++) {
    //         address manufacturerAddr = manufacturerAddresses[i];
    //         addresses[i] = manufacturerAddr;
    //         names[i] = manufacturers[manufacturerAddr].name;
    //         certifications[i] = manufacturers[manufacturerAddr].certification;
    //     }
        
    //     return (addresses, names, certifications);
    // }
    


    // suppliers
    struct SupplierDetails {
        string name;
        uint256 reliabilityRating; // 1-5
        bool isFraud; // is supplier fraud
        string place;
        string emailAddress;
        string[] violations; // المخالفات
    }

    mapping(address => SupplierDetails) public suppliers;
    address[] public supplierAddresses;

    function createSupplier(
        address _supplierAddress,
        string memory _name,
        string memory _place,
        string memory _emailAddress  
    ) public onlyAdmin {
        require(_supplierAddress != address(0), "Invalid address");
        require(!users[_supplierAddress].isRegistered, "User already exists");
        
        users[_supplierAddress] = User({
            userAddress: _supplierAddress,
            role: Role.SUPPLIER,
            isRegistered: true
        });
        
        suppliers[_supplierAddress] = SupplierDetails({
            name: _name,
            reliabilityRating: 5,
            isFraud: false,
            place: _place,
            emailAddress: _emailAddress, 
            violations: new string[](0)
        });
        
        supplierAddresses.push(_supplierAddress);
    }

    function getAllSuppliers() public view returns (
        address[] memory,
        string[] memory,
        uint256[] memory,
        bool[] memory,
        string[] memory,
        string[] memory,  
        string[][] memory 
    ) {
        uint length = supplierAddresses.length;

        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        uint256[] memory ratings = new uint256[](length);
        bool[] memory fraudStatuses = new bool[](length);
        string[] memory places = new string[](length);
        string[] memory emails = new string[](length);  
        string[][] memory allViolations = new string[][](length);  

        for (uint i = 0; i < length; i++) {
            address supplierAddr = supplierAddresses[i];
            addresses[i] = supplierAddr;
            names[i] = suppliers[supplierAddr].name;
            ratings[i] = suppliers[supplierAddr].reliabilityRating;
            fraudStatuses[i] = suppliers[supplierAddr].isFraud;
            places[i] = suppliers[supplierAddr].place;
            emails[i] = suppliers[supplierAddr].emailAddress; 
            allViolations[i] = suppliers[supplierAddr].violations;
        }

        return (addresses, names, ratings, fraudStatuses, places, emails, allViolations);
    }

    // function addViolation(address _supplierAddress, string memory _violation) public onlyAdmin {
    //     require(users[_supplierAddress].isRegistered, "Supplier not registered");

    //     suppliers[_supplierAddress].violations.push(_violation);
    // }


    // raw material
    // struct RawMaterial {
    //     uint256 id;
    //     address supplier;
    //     string name;
    //     string description;
    //     uint256 quantity;
    //     uint256 price;
    //     uint256 timestamp;
    //     bool isAvailable;
    // }

    // uint256 private _materialIds;
    // mapping(uint256 => RawMaterial) public materials;
    // mapping(address => uint256[]) private _supplierMaterials;

    // event MaterialAdded(
    //     uint256 indexed id,
    //     address indexed supplier,
    //     string name,
    //     uint256 quantity,
    //     uint256 price      
    // );

    // event MaterialUpdated(
    //     uint256 indexed id,
    //     uint256 newQuantity,
    //     uint256 newPrice
    // );

    // modifier onlySupplier() {
    //     require(users[msg.sender].isRegistered, "User not registered");
    //     require(users[msg.sender].role == Role.SUPPLIER, "Not a supplier");
    //     _;
    // }


    // function addRawMaterial(
    //     string memory _name,
    //     string memory _description,
    //     uint256 _quantity,
    //     uint256 _price
    // ) external onlySupplier {
    //     require(_quantity > 0, "Quantity must be positive");
    //     require(_price > 0, "Price must be positive");

    //     _materialIds++; // Gestion manuelle des IDs
    //     uint256 newId = _materialIds;

    //     materials[newId] = RawMaterial({
    //         id: newId,
    //         supplier: msg.sender,
    //         name: _name,
    //         description: _description,
    //         quantity: _quantity,
    //         price: _price,
    //         timestamp: block.timestamp,
    //         isAvailable: true
    //     });

    //     _supplierMaterials[msg.sender].push(newId);
    //     emit MaterialAdded(newId, msg.sender, _name, _quantity, _price); 
    // }

    // function modifyRawMaterial(
    //     uint256 _id,
    //     uint256 _newQuantity,
    //     uint256 _newPrice
    // ) external onlySupplier {
    //     require(_id > 0 && _id <= _materialIds, "Invalid material ID"); // Nouveau contrôle
    //     require(materials[_id].supplier == msg.sender, "Not material owner");
    //     require(_newPrice > 0, "Invalid price");

    //     materials[_id].quantity = _newQuantity;
    //     materials[_id].price = _newPrice;
    //     materials[_id].timestamp = block.timestamp;

    //     if(_newQuantity == 0) {
    //         materials[_id].isAvailable = false;
    //     }

    //     emit MaterialUpdated(_id, _newQuantity, _newPrice); 
    // }

    // function getAllRawMaterials() external view returns (RawMaterial[] memory) {
    //     RawMaterial[] memory allMaterials = new RawMaterial[](_materialIds);
        
    //     for(uint256 i = 0; i < _materialIds; i++) {
    //         allMaterials[i] = materials[i + 1]; // Les IDs start 1
    //     }
        
    //     return allMaterials;
    // }
}