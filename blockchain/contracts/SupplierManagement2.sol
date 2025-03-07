// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract SupplierManagement2 is DataStructures {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    struct UpdateMaterialParams {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 quantityAvailable;
        string updatePriceRaison;
    }

    function updateMaterial(UpdateMaterialParams memory params) public onlySupplier {
        require(params.id > 0 && params.id <= materialIdCounter, "Invalid material ID");
        require(helperFunctions.isMaterialOwner(params.id), "Not the material owner");
        require(bytes(params.name).length > 0, "Name cannot be empty");
        require(bytes(params.description).length > 0, "Description cannot be empty");
        require(params.price > 0, "Price must be greater than 0");
        require(params.quantityAvailable > 0, "Quantity must be greater than 0");

        RawMaterial storage material = materials[params.id];
    
        if (params.price != material.price) {
            material.updatePriceRaison = params.updatePriceRaison;
            
            if (helperFunctions.hasTooManyPriceUpdates(material)) {
                material.isAvailable = false;
                material.reviewPriceUpdate = params.price;
                material.reviewReason = FREQUENT_UPDATES;
                
                emit PriceUpdateRequested(params.id, material.price, params.price, FREQUENT_UPDATES);
                return;
            }

            bool isPriceValid = helperFunctions.validateNewPrice(params.name, params.price);
            if (!isPriceValid) {
                material.isAvailable = false;
                material.reviewPriceUpdate = params.price;
                material.reviewReason = HIGHER_PRICE;
                emit PriceUpdateRequested(params.id, material.price, params.price, HIGHER_PRICE);
                return;
            }
        }

        material.name = params.name;
        material.description = params.description;
        material.price = params.price;
        material.quantityAvailable = params.quantityAvailable;
        material.timestamp = block.timestamp;
        material.priceUpdateTimestamps.push(block.timestamp);
        
        emit MaterialUpdated(params.id);
    }

    function getMaterialById(uint256 _id) public view returns (RawMaterial memory) {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        return materials[_id];
    }

    function getAllMaterials() public view returns (RawMaterialWithSupplier[] memory) {
        uint256 validCount = 0;

        for (uint256 i = 1; i <= materialIdCounter; i++) {
            if (materials[i].id != 0) {
                validCount++;
            }
        }

        RawMaterialWithSupplier[] memory result = new RawMaterialWithSupplier[](validCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= materialIdCounter; i++) {
            if (materials[i].id != 0) {
                SupplierDetails memory supplier = userManagement.getSupplierByAddress(materials[i].supplierAddress);
                result[index] = RawMaterialWithSupplier({
                    material: materials[i],
                    supplier: supplier
                });
                index++;
            }
        }

        return result;
    }

    function getSupplierMaterials() public view returns (RawMaterial[] memory) {
        uint256[] storage supplierMaterialIds = supplierToMaterials[msg.sender];
        RawMaterial[] memory result = new RawMaterial[](supplierMaterialIds.length);
        
        for (uint256 i = 0; i < supplierMaterialIds.length; i++) {
            result[i] = materials[supplierMaterialIds[i]];
        }
        
        return result;
    }

    function deleteRawMaterial(address rawMaterialAddress, uint256 _materialIdCounter) external onlyAdmin {
        require(users[rawMaterialAddress].isRegistered, "Distributor not found");
        
        materials[_materialIdCounter].isDeleted = true;
    }

    function getAllManufacturerRawMaterials(address manufacturer) external view returns (uint[] memory) {
        return manufacturerOrders[manufacturer];
    }



}