// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract SupplierManagement2 {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // Modifier to restrict access to suppliers
    modifier onlySupplier() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.SUPPLIER, "Only suppliers can perform this action");
        _;
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.ADMIN, "Not authorized");
        _;
    }

    //
    event PriceUpdateRequested(uint256 indexed id, uint256 oldPrice, uint256 newPrice, string reason);
    event MaterialUpdated(uint256 indexed id);


    struct UpdateMaterialParams {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 quantityAvailable;
        string updatePriceRaison;
    }

    function updateMaterial(UpdateMaterialParams memory params) public onlySupplier {
        require(params.id > 0 && params.id <= dataStructures.getMaterialIdCounter(), "Invalid material ID");
        require(helperFunctions.isMaterialOwner(params.id), "Not the material owner");
        require(bytes(params.name).length > 0, "Name cannot be empty");
        require(bytes(params.description).length > 0, "Description cannot be empty");
        require(params.price > 0, "Price must be greater than 0");
        require(params.quantityAvailable > 0, "Quantity must be greater than 0");

        // Fetch the material using the getter function
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(params.id);

        // Update the material fields
        material.name = params.name;
        material.description = params.description;
        material.price = params.price;
        material.quantityAvailable = params.quantityAvailable;
        material.timestamp = block.timestamp;

        // Handle price updates
        if (params.price != material.price) {
            material.updatePriceRaison = params.updatePriceRaison;

            if (helperFunctions.hasTooManyPriceUpdates(material)) {
                material.isAvailable = false;
                material.reviewPriceUpdate = params.price;
                material.reviewReason = dataStructures.getFrequentUpdates();

                emit PriceUpdateRequested(params.id, material.price, params.price, dataStructures.getFrequentUpdates());
                return;
            }

            bool isPriceValid = helperFunctions.validateNewPrice(params.name, params.price);
            if (!isPriceValid) {
                material.isAvailable = false;
                material.reviewPriceUpdate = params.price;
                material.reviewReason = dataStructures.getHigherPrice();
                emit PriceUpdateRequested(params.id, material.price, params.price, dataStructures.getHigherPrice());
                return;
            }
        }

        // Update the material in storage using the setter function
        dataStructures.setMaterial(params.id, material);

        emit MaterialUpdated(params.id);
    }


    event PriceUpdateConfirmed(uint256 indexed materialId, bool approved);

    function useReviewRawMaterialPrice(uint256 materialId, bool approve) public onlyAdmin {
        require(materialId > 0 && materialId <= dataStructures.getMaterialIdCounter(), "Invalid material ID");

        DataStructures.RawMaterial memory material = dataStructures.getMaterial(materialId);

        require(!material.isAvailable, "Material is not under review");

        if (approve) {
            // Approve new price
            material.price = material.reviewPriceUpdate; 
            material.isAvailable = true;
            material.reviewPriceUpdate = 0;
            material.reviewReason = "";

            dataStructures.setMaterial(materialId, material);

            emit PriceUpdateConfirmed(materialId, true);
        } else {
            // Reject new price
            material.isAvailable = true;
            material.reviewPriceUpdate = 0;
            material.reviewReason = "";

            // Save the updated material back to storage
            dataStructures.setMaterial(materialId, material);

            emit PriceUpdateConfirmed(materialId, false);
        }
    }

    function getMaterialById(uint256 _id) public view returns (DataStructures.RawMaterial memory) {
        require(_id > 0 && _id <= dataStructures.getMaterialIdCounter(), "Invalid material ID");
        return dataStructures.getMaterial(_id);
    }

    function getAllMaterials() public view returns (DataStructures.RawMaterialWithSupplier[] memory) {
        uint256 validCount = 0;

        for (uint256 i = 1; i <= dataStructures.getMaterialIdCounter(); i++) {
            if (dataStructures.getMaterial(i).id != 0) {
                validCount++;
            }
        }

        DataStructures.RawMaterialWithSupplier[] memory result = new DataStructures.RawMaterialWithSupplier[](validCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= dataStructures.getMaterialIdCounter(); i++) {
            if (dataStructures.getMaterial(i).id != 0) {
                DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(dataStructures.getMaterial(i).supplierAddress);
                result[index] = DataStructures.RawMaterialWithSupplier({
                    material: dataStructures.getMaterial(i),
                    supplier: supplier
                });
                index++;
            }
        }

        return result;
    }

    function getSupplierMaterials() public view returns (DataStructures.RawMaterial[] memory) {
        uint256[] memory supplierMaterialIds = dataStructures.getSupplierMaterials(msg.sender);
        DataStructures.RawMaterial[] memory result = new DataStructures.RawMaterial[](supplierMaterialIds.length);

        for (uint256 i = 0; i < supplierMaterialIds.length; i++) {
            result[i] = dataStructures.getMaterial(supplierMaterialIds[i]);
        }

        return result;
    }

    function getSupplierMaterialsByAddress(address supplierAddress) public view returns (DataStructures.RawMaterial[] memory) {
        // Count materials associated with the supplier
        uint256 count = 0;
        for (uint256 i = 1; i <= dataStructures.getMaterialIdCounter(); i++) {
            if (dataStructures.getMaterial(i).supplierAddress == supplierAddress) {
                count++;
            }
        }

        DataStructures.RawMaterial[] memory result = new DataStructures.RawMaterial[](count);

        // Populate the result
        uint256 index = 0;
        for (uint256 i = 1; i <= dataStructures.getMaterialIdCounter(); i++) {
            if (dataStructures.getMaterial(i).supplierAddress == supplierAddress) {
                result[index] = dataStructures.getMaterial(i);
                index++;
            }
        }

        return result;
    }

    function deleteRawMaterial(address rawMaterialAddress, uint256 _materialIdCounter) external onlyAdmin {
        require(dataStructures.getUser(rawMaterialAddress).isRegistered, "Distributor not found");

        DataStructures.RawMaterial memory material = dataStructures.getMaterial(_materialIdCounter);

        material.isDeleted = true;

        dataStructures.setMaterial(_materialIdCounter, material);
    }

    function getAllManufacturerRawMaterials(address manufacturer) external view returns (uint[] memory) {
        return dataStructures.getManufacturerOrders(manufacturer);
    }
}