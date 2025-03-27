
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
  "UserManagement": "0x4b73943839D610F97351cf7615D733bDcd271C14",
  "SupplierManagement": "0x92ad2046Be3f111af75d436CB55fFfc490116343",
  "SupplierManagement2": "0x98B23A645aCB46DEe62f4869DE44055e383aa49e",
  "OrderManagement": "0x1d2F07114b89c0D92E442F483Df7Fd7095FA5d1E",
  "OrderManagement2": "0x97Ba01cB4813C5cAFD5EA83366054830C72CF80B",
  "Dashboard": "0x835fa6D705c1A2B41b24e81A6bf5209197cc4DDc",
  "DataStructures": "0x76cc72f4cfBd4B51989c1d60C44Da3C47D550467"
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
