
import { ethers } from "ethers";
import UserManagementABI from "./UserManagement.json";
import SupplierManagementABI from "./SupplierManagement.json";
import SupplierManagement2ABI from "./SupplierManagement2.json";
import OrderManagementABI from "./OrderManagement.json";
import OrderManagement2ABI from "./OrderManagement2.json";
import DashboardABI from "./Dashboard.json";
import DataStructuresABI from "./DataStructures.json";

export const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';

export const contractAddresses = {
  "UserManagement": "0x1E8CB9d20CEb44b5691052e3ce83f13cE94dd7B0",
  "SupplierManagement": "0x5A4a7cDED80801cDDE929dfc153D3e86C6f6B3CA",
  "SupplierManagement2": "0xCfe9b1d96Cb849fE12a9948f0D7484C5975971e2",
  "OrderManagement": "0x61ea0cf6717f227E808b9a15Cb180d663C6Ba753",
  "OrderManagement2": "0xe75ab3E3264ec06EaaE0060E91b7BCaBaF459828",
  "Dashboard": "0x79dff1c81B3B0C345523d3d3e6b4e02d19ffAa5c",
  "DataStructures": "0xA6bF895e8Dc7401faC48c2DCAbD0fe1c0604E113"
};

export const contractABIs = {
  UserManagement: UserManagementABI.abi,
  SupplierManagement: SupplierManagementABI.abi,
  SupplierManagement2: SupplierManagement2ABI.abi,
  OrderManagement: OrderManagementABI.abi,
  OrderManagement2: OrderManagement2ABI.abi,
  Dashboard: DashboardABI.abi,
  DataStructures: DataStructuresABI.abi,
};

// Create Ethereum contract instance
export const createEthereumContract = async (contractName) => {
    try {
        if (!window.ethereum) throw new Error("Please install MetaMask!");

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(accounts[0]);

        const contract = new ethers.Contract(
            contractAddresses[contractName],
            contractABIs[contractName],
            signer
        );

        console.log(`Contract ${contractName} connected with account:`, accounts[0]);
        return contract;
    } catch (error) {
        console.error("Error in createEthereumContract:", error);
        throw error;
    }
};
