const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Paths
const artifactsPath = path.join(__dirname, "../artifacts/contracts");
const clientUtilsPath = path.join(__dirname, "../../client/src/app/utils");
const clientConstantsPath = path.join(clientUtilsPath, "constants.js");

// List of contract names
const contractNames = [
  "UserManagement",
  "SupplierManagement",
  "SupplierManagement2",
  "OrderManagement",
  "OrderManagement2",
  "Dashboard",
  "DataStructures",
];

// Function to clear the content of a file
const clearFileContent = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, ""); // Clear the file content
    console.log(`Cleared content of ${filePath}`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
};

const main = async () => {
  const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';
  const supplierAddress = '0x56a2382c9C81Cbe57EfB63F40bb822eEBB6E8D42';
  const manufacturerAddress = '0xb1928627cD6CfBF28e2EfbF9E16207874F0AFea8';
  const distributorAddress = '0xF14248090D4afCc6883882274B3a3e19B48018ad';

  // Clear the content of constants.js
  clearFileContent(clientConstantsPath);

  // Clear the content of ABI JSON files in client/utils
  contractNames.forEach((contractName) => {
    const clientArtifactPath = path.join(clientUtilsPath, `${contractName}.json`);
    clearFileContent(clientArtifactPath);
  });

  // Deploy DataStructures
  const DataStructuresFactory = await hre.ethers.getContractFactory("DataStructures");
  const dataStructuresContract = await DataStructuresFactory.deploy({ gasLimit: 5000000 });
  await dataStructuresContract.deployed();
  console.log("DataStructures address: ", dataStructuresContract.address);

  // Deploy HelperFunctions
  const HelperFunctionsFactory = await hre.ethers.getContractFactory("HelperFunctions");
  const helperFunctionsContract = await HelperFunctionsFactory.deploy({ gasLimit: 5000000 });
  await helperFunctionsContract.deployed();
  console.log("HelperFunctions address: ", helperFunctionsContract.address);

  // Deploy UserManagement 
  const UserManagementFactory = await hre.ethers.getContractFactory("UserManagement");
  const userManagementContract = await UserManagementFactory.deploy(
    adminAddress,
    supplierAddress,
    manufacturerAddress,
    distributorAddress,
    dataStructuresContract.address,
    { gasLimit: 5000000 }
  );
  await userManagementContract.deployed();
  console.log("UserManagement address: ", userManagementContract.address);

  // Deploy SupplierManagement
  const SupplierManagementFactory = await hre.ethers.getContractFactory("SupplierManagement");
  const supplierManagementContract = await SupplierManagementFactory.deploy(
    dataStructuresContract.address,
    { gasLimit: 5000000 }
  );
  await supplierManagementContract.deployed();
  console.log("SupplierManagement address: ", supplierManagementContract.address);

  // Deploy SupplierManagement2
  const SupplierManagement2Factory = await hre.ethers.getContractFactory("SupplierManagement2");
  const supplierManagement2Contract = await SupplierManagement2Factory.deploy(
    dataStructuresContract.address,
    { gasLimit: 5000000 }
  );
  await supplierManagement2Contract.deployed();
  console.log("SupplierManagement2 address: ", supplierManagement2Contract.address);

  // Deploy OrderManagement
  const OrderManagementFactory = await hre.ethers.getContractFactory("OrderManagement");
  const orderManagementContract = await OrderManagementFactory.deploy(
    dataStructuresContract.address,
    { gasLimit: 5000000 }
  );
  await orderManagementContract.deployed();
  console.log("OrderManagement address: ", orderManagementContract.address);

  // Deploy OrderManagement2
  const OrderManagement2Factory = await hre.ethers.getContractFactory("OrderManagement2");
  const orderManagement2Contract = await OrderManagement2Factory.deploy(
    dataStructuresContract.address,
    { gasLimit: 5000000 }
  );
  await orderManagement2Contract.deployed();
  console.log("OrderManagement2 address: ", orderManagement2Contract.address);

  // Deploy Dashboard
  const DashboardFactory = await hre.ethers.getContractFactory("Dashboard");
  const dashboardContract = await DashboardFactory.deploy(
    dataStructuresContract.address,
    { gasLimit: 5000000 }
  );
  await dashboardContract.deployed();
  console.log("Dashboard address: ", dashboardContract.address);

  // Copy ABI files to client/utils
  contractNames.forEach((contractName) => {
    const artifactPath = path.join(artifactsPath, `${contractName}.sol/${contractName}.json`);
    const clientArtifactPath = path.join(clientUtilsPath, `${contractName}.json`);

    if (fs.existsSync(artifactPath)) {
      fs.copyFileSync(artifactPath, clientArtifactPath);
      console.log(`Copied ${contractName}.json to client/utils`);
    } else {
      console.error(`Artifact not found for ${contractName}`);
    }
  });

  // Prepare contract data for constants.js
  const contractData = {
    adminAddress,
    contractAddresses: {
      UserManagement: userManagementContract.address,
      SupplierManagement: supplierManagementContract.address,
      SupplierManagement2: supplierManagement2Contract.address,
      OrderManagement: orderManagementContract.address,
      OrderManagement2: orderManagement2Contract.address,
      Dashboard: dashboardContract.address,
      DataStructures: dataStructuresContract.address,
    },
  };

  // Generate constants.js file
  const constantsFileContent = `
import { ethers } from "ethers";
import UserManagementABI from "./UserManagement.json";
import SupplierManagementABI from "./SupplierManagement.json";
import SupplierManagement2ABI from "./SupplierManagement2.json";
import OrderManagementABI from "./OrderManagement.json";
import OrderManagement2ABI from "./OrderManagement2.json";
import DashboardABI from "./Dashboard.json";
import DataStructuresABI from "./DataStructures.json";

export const adminAddress = '${contractData.adminAddress}';

export const contractAddresses = ${JSON.stringify(contractData.contractAddresses, null, 2)};

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

        console.log(\`Contract \${contractName} connected with account:\`, accounts[0]);
        return contract;
    } catch (error) {
        console.error("Error in createEthereumContract:", error);
        throw error;
    }
};
`;

  // Write constants.js file
  fs.writeFileSync(clientConstantsPath, constantsFileContent);
  console.log("Generated constants.js file in client/utils");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();