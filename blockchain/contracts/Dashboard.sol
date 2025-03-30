// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract Dashboard {
    DataStructures public dataStructures;
    UserManagement public userManagement; 
    HelperFunctions public helperFunctions; 

    constructor(address _dataStructuresAddress) {
        require(_dataStructuresAddress != address(0), "Invalid DataStructures address");
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    function getUsersStatistics()
        public
        view
        returns (
            uint256 supplierCount,
            uint256 manufacturerCount,
            uint256 distributorCount
        )
    {
        supplierCount = 0;
        manufacturerCount = 0;
        distributorCount = 0;

        address[] memory supplierAddresses = dataStructures.getSupplierAddresses();
        for (uint256 i = 0; i < supplierAddresses.length; i++) {
            if (dataStructures.getUser(supplierAddresses[i]).isRegistered && 
                !dataStructures.getSupplier(supplierAddresses[i]).isDeleted) {
                supplierCount++;
            }
        }

        address[] memory manufacturerAddresses = dataStructures.getManufacturerAddresses();
        for (uint256 i = 0; i < manufacturerAddresses.length; i++) {
            if (dataStructures.getUser(manufacturerAddresses[i]).isRegistered && 
                !dataStructures.getManufacturer(manufacturerAddresses[i]).isDeleted) {
                manufacturerCount++;
            }
        }

        address[] memory distributorAddresses = dataStructures.getDistributorAddresses();
        for (uint256 i = 0; i < distributorAddresses.length; i++) {
            if (dataStructures.getUser(distributorAddresses[i]).isRegistered && 
                !dataStructures.getDistributor(distributorAddresses[i]).isDeleted) {
                distributorCount++;
            }
        }

        return (supplierCount, manufacturerCount, distributorCount);
    }

    function getSupplierStatistics()
        public
        view
        returns (
            uint256 fraudCount,
            uint256 reliableCount,
            uint256 underReviewCount
        )
    {
        fraudCount = 0;
        reliableCount = 0;
        underReviewCount = 0;

        address[] memory supplierAddresses = dataStructures.getSupplierAddresses();
        for (uint256 i = 0; i < supplierAddresses.length; i++) {
            DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddresses[i]);
            if (supplier.isDeleted) continue;

            bytes32 fraudHash = keccak256(abi.encodePacked(supplier.isFraud));
            if (fraudHash == keccak256(abi.encodePacked("Fraud"))) {
                fraudCount++;
            } else if (fraudHash == keccak256(abi.encodePacked("Reliable"))) {
                reliableCount++;
            } else if (fraudHash == keccak256(abi.encodePacked("Under Review"))) {
                underReviewCount++;
            }
        }

        return (fraudCount, reliableCount, underReviewCount);
    }

    function getOrdersStatistics()
        public
        view
        returns (
            uint256 pendingProductionCount,
            uint256 manufacturedCount,
            uint256 shippedToDistributorCount,
            uint256 arrivedToDistributorCount,
            uint256 shippedToClientCount,
            uint256 deliveredToClientCount
        )
    {
        pendingProductionCount = 0;
        manufacturedCount = 0;
        shippedToDistributorCount = 0;
        arrivedToDistributorCount = 0;
        shippedToClientCount = 0;
        deliveredToClientCount = 0;

        uint256 orderCounter = dataStructures.getOrderCounter();
        for (uint256 i = 1; i <= orderCounter; i++) {
            DataStructures.Order memory order = dataStructures.getOrder(i);

            // Use boolean flags instead of string status for precision
            if (!order.isProduced) {
                pendingProductionCount++;
            } else if (order.isProduced && !order.isShippedToDistributor) {
                manufacturedCount++;
            } else if (order.isShippedToDistributor && !order.isArrivedToDistributor) {
                shippedToDistributorCount++;
            } else if (order.isArrivedToDistributor) {
                arrivedToDistributorCount++;
            }

            // Client orders
            DataStructures.ClientOrder[] memory clientOrdersForOrder = dataStructures.getClientOrders(i);
            for (uint256 j = 0; j < clientOrdersForOrder.length; j++) {
                if (clientOrdersForOrder[j].isShippedToClient && !clientOrdersForOrder[j].isArrivedToClient) {
                    shippedToClientCount++;
                } else if (clientOrdersForOrder[j].isArrivedToClient) {
                    deliveredToClientCount++;
                }
            }
        }

        return (
            pendingProductionCount,
            manufacturedCount,
            shippedToDistributorCount,
            arrivedToDistributorCount,
            shippedToClientCount,
            deliveredToClientCount
        );
    }

    function getMaterialOrderStatistics()
        public
        view
        returns (
            uint256 pendingCount,
            uint256 shippedToManufacturerCount,
            uint256 arrivedToManufacturerCount,
            uint256 deliveredCount,
            uint256 canceledCount
        )
    {
        pendingCount = 0;
        shippedToManufacturerCount = 0;
        arrivedToManufacturerCount = 0;
        deliveredCount = 0;
        canceledCount = 0;

        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(i);
            bytes32 statusHash = keccak256(abi.encodePacked(order.status));

            // Interpret status with timestamps for manufacturer stages
            if (statusHash == keccak256(abi.encodePacked("Pending"))) {
                pendingCount++;
            } else if (statusHash == keccak256(abi.encodePacked("Shipped"))) {
                if (order.shippedAt > 0 && order.arrivedAt == 0) {
                    shippedToManufacturerCount++;
                }
            } else if (statusHash == keccak256(abi.encodePacked("Delivered"))) {
                if (order.arrivedAt > 0 && order.quantityreceived >= order.quantityOrdered) {
                    deliveredCount++;
                } else if (order.arrivedAt > 0) {
                    arrivedToManufacturerCount++; // Arrived but not fully delivered
                }
            } else if (statusHash == keccak256(abi.encodePacked("Canceled"))) {
                canceledCount++;
            }
        }

        return (
            pendingCount,
            shippedToManufacturerCount,
            arrivedToManufacturerCount,
            deliveredCount,
            canceledCount
        );
    }
}