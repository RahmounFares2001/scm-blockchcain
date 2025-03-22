// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";

contract HelperFunctions {
    DataStructures public dataStructures;

    // validators
    function validateNewPrice(string memory _name, uint256 _newPrice) public view returns (bool) {
        uint256 materialIdCounter = dataStructures.getMaterialIdCounter();
        for (uint256 i = 1; i <= materialIdCounter; i++) {
            DataStructures.RawMaterial memory material = dataStructures.getMaterial(i);

            // Use the destructured variables
            if (keccak256(bytes(material.name)) == keccak256(bytes(_name)) && 
                !material.isDeleted && 
                material.isAvailable) {
                if (_newPrice > material.price) {
                    return false;
                }
            }
        }
        return true;
    }

    function hasTooManyPriceUpdates(uint256 id) external view returns (bool) {
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(id); 

        uint256 updateCount = 0;
        uint256 sixMonthsAgo = block.timestamp - dataStructures.getSixMonths();

        for (uint256 i = 0; i < material.priceUpdateTimestamps.length; i++) {
            if (material.priceUpdateTimestamps[i] > sixMonthsAgo) {
                updateCount++;
                if (updateCount >= dataStructures.getMaxPriceUpdates()) {
                    return true;
                }
            }
        }
        return false;
    }


    // check if he is the material owner
    function isMaterialOwner(uint256 _id) external view returns (bool) {
        // Get the array of materials owned by the message sender
        uint256[] memory supplierMaterials = dataStructures.getSupplierMaterials(msg.sender); // Use getter function
        for (uint256 i = 0; i < supplierMaterials.length; i++) {
            if (supplierMaterials[i] == _id) {
                return true;
            }
        }
        return false;
    }

    // Helper function to convert uint to string
    function toString(uint256 value) external pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    // Helper function to get review reason (for admin interface)
    function getReviewReason(uint256 _id) external view returns (string memory) {
        require(_id > 0 && _id <= dataStructures.getMaterialIdCounter(), "Invalid material ID");
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(_id); // Use getter function
        return material.reviewReason;
    }

    // create hash from order details
    function createProductHash(uint256 quantity, uint256 producedAt, uint256 shippedAt) external pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(quantity, producedAt, shippedAt)));
    }
}