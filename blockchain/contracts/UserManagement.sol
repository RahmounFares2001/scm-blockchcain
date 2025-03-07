// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./DataStructures.sol";

contract UserManagement is DataStructures {
    DataStructures public dataStructures;

    // admin
    constructor(address _adminAddress, address _dataStructuresAddress) {
        require(!adminCreated, "Admin already created");
        require(_adminAddress != address(0), "Invalid admin address");

        dataStructures = DataStructures(_dataStructuresAddress);

        admin = _adminAddress;
        users[_adminAddress] = User({
            userAddress: _adminAddress,
            role: Role.ADMIN,
            isRegistered: true
        });
        adminCreated = true;
    }

    // distributor 
    function createDistributor(
        address _distributorAddress,
        string memory _name,
        string memory _emailAddress,
        string memory _place
    ) public onlyAdmin {
        require(_distributorAddress != address(0), "Invalid address");
        require(!users[_distributorAddress].isRegistered, "User already exists");
        
        users[_distributorAddress] = User({
            userAddress: _distributorAddress,
            role: Role.DISTRIBUTOR,
            isRegistered: true
        });
        
        distributors[_distributorAddress] = DistributorDetails({
            name: _name,
            emailAddress: _emailAddress,
            place: _place,
            isDeleted: false });
        distributorAddresses.push(_distributorAddress);
    }

    struct DistributorInfo {
        address[] addresses;
        string[] names;
        string[] emailAddresses;
        string[] places;
    }

    function getAllDistributors() public view returns (DistributorInfo memory) {
        uint length = distributorAddresses.length;
        
        DistributorInfo memory info = DistributorInfo({
            addresses: new address[](length),
            names: new string[](length),
            emailAddresses: new string[](length),
            places: new string[](length)
        });
        
        for(uint i = 0; i < length; i++) {
            address distributorAddr = distributorAddresses[i];
            info.addresses[i] = distributorAddr;
            info.names[i] = distributors[distributorAddr].name;
            info.emailAddresses[i] = distributors[distributorAddr].emailAddress; 
            info.places[i] = distributors[distributorAddr].place;
        }
        
        return info; 
    }

    function getDistributorByAddress(address distributorAddress) public view returns (DistributorDetails memory) {
        require(users[distributorAddress].isRegistered == true, "Distributor does not exist");
        return distributors[distributorAddress];
    }

    function deleteDistributor(address distributorAddress) external onlyAdmin {
        require(users[distributorAddress].isRegistered, "Distributor not found");
        
        distributors[distributorAddress].isDeleted = true;
    }

    // manufacturer
    function createManufacturer(
        address _manufacturerAddress,
        string memory _name,
        string memory _email,
        string memory _place
    ) public onlyAdmin {
        require(_manufacturerAddress != address(0), "Invalid address");
        require(!users[_manufacturerAddress].isRegistered, "User already exists");
        
        users[_manufacturerAddress] = User({
            userAddress: _manufacturerAddress,
            role: Role.MANUFACTURER,
            isRegistered: true
        });
        
        manufacturers[_manufacturerAddress] = ManufacturerDetails({
            name: _name,
            email: _email,
            place: _place,
            isDeleted: false });
        manufacturerAddresses.push(_manufacturerAddress);
    }

    struct ManufacturerInfo {
        address[] addresses;
        string[] names;
        string[] emails;
        string[] places;
    }

    function getAllManufacturers() public view returns (ManufacturerInfo memory) {
        uint length = manufacturerAddresses.length;
        
        ManufacturerInfo memory info = ManufacturerInfo({
            addresses: new address[](length),
            names: new string[](length),
            emails: new string[](length),
            places: new string[](length)
        });
        
        for(uint i = 0; i < length; i++) {
            address manufacturerAddr = manufacturerAddresses[i];
            info.addresses[i] = manufacturerAddr;
            info.names[i] = manufacturers[manufacturerAddr].name;
            info.emails[i] = manufacturers[manufacturerAddr].email;
            info.places[i] = manufacturers[manufacturerAddr].place;
        }
        
        return info;
    }

    function getManufacturerByAddress(address manufacturerAddress) public view returns (ManufacturerDetails memory) {
        require(users[manufacturerAddress].isRegistered == true, "Manufacturer does not exist");
        return manufacturers[manufacturerAddress];
    }

    function deleteManufacturer(address manufacturerAddress) external onlyAdmin {
        require(users[manufacturerAddress].isRegistered, "Manufacturer not found");
        
        suppliers[manufacturerAddress].isDeleted = true;
    }

    // suppliers
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
            isFraud: "Reliable",
            place: _place,
            emailAddress: _emailAddress, 
            violations: new string[](0),
            isDeleted: false
        });
        
        supplierAddresses.push(_supplierAddress);
    }

    struct SupplierInfo {
        address[] addresses;
        string[] names;
        uint256[] ratings;
        string[] fraudStatuses;
        string[] places;
        string[] emails;
        string[][] allViolations;
    }

    function getAllSuppliers() public view returns (SupplierInfo memory) {
        uint length = supplierAddresses.length;

        SupplierInfo memory info = SupplierInfo({
            addresses: new address[](length),
            names: new string[](length),
            ratings: new uint256[](length),
            fraudStatuses: new string[](length),
            places: new string[](length),
            emails: new string[](length),
            allViolations: new string[][](length)
        });

        for (uint i = 0; i < length; i++) {
            address supplierAddr = supplierAddresses[i];
            info.addresses[i] = supplierAddr;
            info.names[i] = suppliers[supplierAddr].name;
            info.ratings[i] = suppliers[supplierAddr].reliabilityRating;
            info.fraudStatuses[i] = suppliers[supplierAddr].isFraud;
            info.places[i] = suppliers[supplierAddr].place;
            info.emails[i] = suppliers[supplierAddr].emailAddress; 
            info.allViolations[i] = suppliers[supplierAddr].violations;
        }

        return info;
    }

    function getSupplierByAddress(address supplierAddress) public view returns (SupplierDetails memory) {
        require(users[supplierAddress].isRegistered == true, "Supplier does not exist");
        return suppliers[supplierAddress];
    }

    function deleteSupplier(address supplierAddress) external onlyAdmin {
        require(users[supplierAddress].isRegistered, "Supplier not found");
        
        suppliers[supplierAddress].isDeleted = true;
    }
}