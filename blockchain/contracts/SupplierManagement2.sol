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


    function updateMaterialPrice(
        uint256 id,
        string memory name,
        uint256 price,
        string memory updatePriceRaison
    ) public onlySupplier {
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(id);

        if (price != material.price) {

            uint256[] memory newPriceUpdateTimestamps = new uint256[](material.priceUpdateTimestamps.length + 1);
            // copy old to the new table
            for (uint256 i = 0; i < material.priceUpdateTimestamps.length; i++) {
                newPriceUpdateTimestamps[i] = material.priceUpdateTimestamps[i];
            }
            // add new 
            newPriceUpdateTimestamps[newPriceUpdateTimestamps.length - 1] = block.timestamp;
            material.priceUpdateTimestamps = newPriceUpdateTimestamps;

            // Update the material fields
            material.updatePriceRaison = updatePriceRaison;

            // Check for too many price updates
            bool manyUpdates = hasTooManyPriceUpdates(id);
            if (manyUpdates) {
                material.isAvailable = false;
                material.reviewPriceUpdate = price;
                material.reviewReason = "FREQUENT_UPDATES";

                dataStructures.setMaterial(id, material);
                emit PriceUpdateRequested(id, material.price, price, "FREQUENT_UPDATES");
                return;
            }

            // Validate the new price
            bool isPriceValid = validateNewPrice(name, price);
            if (!isPriceValid) {
                material.isAvailable = false;
                material.reviewPriceUpdate = price;
                material.reviewReason = "HIGHER_PRICE";
                dataStructures.setMaterial(id, material);
                emit PriceUpdateRequested(id, material.price, price, "HIGHER_PRICE");
                return;
            }

            
            material.price = price; 
            dataStructures.setMaterial(id, material);
            emit MaterialUpdated(id);
        }

    }

    function updateMaterialQuantity(uint256 id, uint256 newQuantity) public {
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(id);
        material.quantityAvailable = newQuantity;
        dataStructures.setMaterial(id, material);
        emit MaterialUpdated(id);
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

    // helpers
    // validators
    function validateNewPrice(string memory _name, uint256 _newPrice) internal view returns (bool) {
        uint256 materialIdCounter = dataStructures.getMaterialIdCounter();
        bool foundMaterial = false;
        uint256 highestPrice = 0; 
        
        // find the highest price 
        for (uint256 i = 1; i <= materialIdCounter; i++) {
            DataStructures.RawMaterial memory material = dataStructures.getMaterial(i);
            
            if (keccak256(bytes(material.name)) == keccak256(bytes(_name)) && 
                !material.isDeleted) {
                foundMaterial = true;
                if (material.price > highestPrice) {
                    highestPrice = material.price;
                }
            }
        }
        
        // check if new price is higher
        if (foundMaterial && _newPrice > highestPrice) {
            return false;
        }
        
        return true;
    }

    function hasTooManyPriceUpdates(uint256 id) internal view returns (bool) {
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(id); 

        uint256 updateCount = 0;
        uint256 sixMonthsAgo = block.timestamp - dataStructures.getSixMonths();

        for (uint256 i = 0; i < material.priceUpdateTimestamps.length; i++) {
            if (material.priceUpdateTimestamps[i] > sixMonthsAgo) {
                updateCount++;
            }
        }

        return updateCount > 1;
    }   
}