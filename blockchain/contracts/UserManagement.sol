// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./DataStructures.sol";

contract UserManagement {
    DataStructures public dataStructures;

    // Constructor
    constructor(address _adminAddress, address _dataStructuresAddress) {
        // require(!dataStructures.getAdminCreated(), "Admin already created");
        require(_adminAddress != address(0), "Invalid admin address");

        dataStructures = DataStructures(_dataStructuresAddress);

        // Set admin
        dataStructures.addUser(_adminAddress, DataStructures.Role.ADMIN, true);
        dataStructures.setAdmin(_adminAddress);
        dataStructures.setAdminCreated(true);
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.ADMIN, "Not authorized");
        _;
    }

    // Distributor functions

    function createDistributor(
        address _distributorAddress,
        string memory _name,
        string memory _emailAddress,
        string memory _place
    ) public onlyAdmin {
        require(_distributorAddress != address(0), "Invalid address");
        require(!dataStructures.getUser(_distributorAddress).isRegistered, "User already exists");
        
        dataStructures.addUser(_distributorAddress, DataStructures.Role.DISTRIBUTOR, true);
        
        dataStructures.addDistributor(_distributorAddress, DataStructures.DistributorDetails({
            name: _name,
            emailAddress: _emailAddress,
            place: _place,
            isDeleted: false
        }));

        dataStructures.addDistributorAddress(_distributorAddress);
    }

    struct DistributorInfo {
        address[] addresses;
        string[] names;
        string[] emailAddresses;
        string[] places;
    }

    function getAllDistributors() public view returns (DistributorInfo memory) {
        uint length = dataStructures.getDistributorAddressesCount();
        
        DistributorInfo memory info = DistributorInfo({
            addresses: new address[](length),
            names: new string[](length),
            emailAddresses: new string[](length),
            places: new string[](length)
        });
        
        for (uint i = 0; i < length; i++) {
            address distributorAddr = dataStructures.getDistributorAddress(i);
            info.addresses[i] = distributorAddr;
            info.names[i] = dataStructures.getDistributor(distributorAddr).name;
            info.emailAddresses[i] = dataStructures.getDistributor(distributorAddr).emailAddress;
            info.places[i] = dataStructures.getDistributor(distributorAddr).place;
        }
        
        return info;
    }

    function getDistributorByAddress(address distributorAddress) public view returns (DataStructures.DistributorDetails memory) {
        require(dataStructures.getUser(distributorAddress).isRegistered, "Distributor does not exist");
        return dataStructures.getDistributor(distributorAddress);
    }

    function deleteDistributor(address distributorAddress) external onlyAdmin {
        require(dataStructures.getUser(distributorAddress).isRegistered, "Distributor not found");
        
        DataStructures.DistributorDetails memory distributor = dataStructures.getDistributor(distributorAddress);
        distributor.isDeleted = true;
        dataStructures.addDistributor(distributorAddress, distributor);
    }

    // Manufacturer functions

    function createManufacturer(
        address _manufacturerAddress,
        string memory _name,
        string memory _email,
        string memory _place
    ) public onlyAdmin {
        require(_manufacturerAddress != address(0), "Invalid address");
        require(!dataStructures.getUser(_manufacturerAddress).isRegistered, "User already exists");
        
        dataStructures.addUser(_manufacturerAddress, DataStructures.Role.MANUFACTURER, true);
        
        dataStructures.addManufacturer(_manufacturerAddress, DataStructures.ManufacturerDetails({
            name: _name,
            email: _email,
            place: _place,
            isDeleted: false
        }));

        dataStructures.addManufacturerAddress(_manufacturerAddress);
    }

    struct ManufacturerInfo {
        address[] addresses;
        string[] names;
        string[] emails;
        string[] places;
    }

    function getAllManufacturers() public view returns (ManufacturerInfo memory) {
        uint length = dataStructures.getManufacturerAddressesCount();
        
        ManufacturerInfo memory info = ManufacturerInfo({
            addresses: new address[](length),
            names: new string[](length),
            emails: new string[](length),
            places: new string[](length)
        });
        
        for (uint i = 0; i < length; i++) {
            address manufacturerAddr = dataStructures.getManufacturerAddress(i);
            info.addresses[i] = manufacturerAddr;
            info.names[i] = dataStructures.getManufacturer(manufacturerAddr).name;
            info.emails[i] = dataStructures.getManufacturer(manufacturerAddr).email;
            info.places[i] = dataStructures.getManufacturer(manufacturerAddr).place;
        }
        
        return info;
    }

    function getManufacturerByAddress(address manufacturerAddress) public view returns (DataStructures.ManufacturerDetails memory) {
        require(dataStructures.getUser(manufacturerAddress).isRegistered, "Manufacturer does not exist");
        return dataStructures.getManufacturer(manufacturerAddress);
    }

    function deleteManufacturer(address manufacturerAddress) external onlyAdmin {
        require(dataStructures.getUser(manufacturerAddress).isRegistered, "Manufacturer not found");
        
        DataStructures.ManufacturerDetails memory manufacturer = dataStructures.getManufacturer(manufacturerAddress);
        manufacturer.isDeleted = true;
        dataStructures.addManufacturer(manufacturerAddress, manufacturer);
    }

    // Supplier functions

    function createSupplier(
        address _supplierAddress,
        string memory _name,
        string memory _place,
        string memory _emailAddress  
    ) public onlyAdmin {
        require(_supplierAddress != address(0), "Invalid address");
        require(!dataStructures.getUser(_supplierAddress).isRegistered, "User already exists");
        
        dataStructures.addUser(_supplierAddress, DataStructures.Role.SUPPLIER, true);
        
        dataStructures.addSupplier(_supplierAddress, DataStructures.SupplierDetails({
            name: _name,
            reliabilityRating: 5,
            isFraud: "Reliable",
            place: _place,
            emailAddress: _emailAddress,
            violations: new string[](0),
            isDeleted: false
        }));

        dataStructures.addSupplierAddress(_supplierAddress);
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
        uint length = dataStructures.getSupplierAddressesCount();

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
            address supplierAddr = dataStructures.getSupplierAddress(i);
            info.addresses[i] = supplierAddr;
            info.names[i] = dataStructures.getSupplier(supplierAddr).name;
            info.ratings[i] = dataStructures.getSupplier(supplierAddr).reliabilityRating;
            info.fraudStatuses[i] = dataStructures.getSupplier(supplierAddr).isFraud;
            info.places[i] = dataStructures.getSupplier(supplierAddr).place;
            info.emails[i] = dataStructures.getSupplier(supplierAddr).emailAddress;
            info.allViolations[i] = dataStructures.getSupplier(supplierAddr).violations;
        }

        return info;
    }

    function getSupplierByAddress(address supplierAddress) public view returns (DataStructures.SupplierDetails memory) {
        require(dataStructures.getUser(supplierAddress).isRegistered, "Supplier does not exist");
        return dataStructures.getSupplier(supplierAddress);
    }

    function deleteSupplier(address supplierAddress) external onlyAdmin {
        require(dataStructures.getUser(supplierAddress).isRegistered, "Supplier not found");
        
        DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddress);
        supplier.isDeleted = true;
        dataStructures.addSupplier(supplierAddress, supplier);
    }
}