
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
  "UserManagement": "0x0d37bE761DF3380451369dba677dc282fA6E4AEC",
  "SupplierManagement": "0xB0A4c2E97b6b029073D555ec4b50A66765d34E57",
  "SupplierManagement2": "0xb752617BC1D4A0Bbbb43d17317DDC51152B160E6",
  "OrderManagement": "0x14c4EAC8e960f65fF70ee9e0B86e8451C4b2B180",
  "OrderManagement2": "0xd27a6D02f90cC6Cef979c4413F02d456FCac67eA",
  "Dashboard": "0xFe4E888293AfD891C845D604d65B193Ec42fB6c8",
  "DataStructures": "0xAd23495dFE90e022255F1112A019DaefeD08ec96"
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

// client contract
const adminPrivateKey = "2defdd7833f34dbeb1eaaa41070833730b86b77decb7e76e5f3c166c8cb47968";
const rpcUrl = "http://127.0.0.1:7545";
export const createClientEthereumContract = async (contractName) => {
    try {
      // Use Ganache local RPC provider
      const provider = new ethers.JsonRpcProvider(rpcUrl);
  
      // Create a wallet with the admin private key
      const wallet = new ethers.Wallet(adminPrivateKey, provider);
      const signer = wallet;
  
      const contract = new ethers.Contract(
        contractAddresses[contractName],
        contractABIs[contractName],
        signer
      );
  
      return contract;
    } catch (error) {
      console.error("Error in createEthereumContract:", error);
      throw error;
    }
};
