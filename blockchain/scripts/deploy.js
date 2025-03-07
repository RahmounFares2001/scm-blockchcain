const main = async () => {
  const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74'; // Replace with your admin address

  // Deploy DataStructures
  const DataStructuresFactory = await hre.ethers.getContractFactory("DataStructures");
  const dataStructuresContract = await DataStructuresFactory.deploy();
  await dataStructuresContract.deployed();
  console.log("DataStructures address: ", dataStructuresContract.address);

  // HelperFunctions
  const HelperFunctionsFactory = await hre.ethers.getContractFactory("HelperFunctions");
  const helperFunctionsContract = await HelperFunctionsFactory.deploy(); // No arguments
  await helperFunctionsContract.deployed();
  console.log("HelperFunctions address: ", helperFunctionsContract.address);

  // UserManagement 
  const UserManagementFactory = await hre.ethers.getContractFactory("UserManagement");
  const userManagementContract = await UserManagementFactory.deploy(adminAddress, dataStructuresContract.address);
  await userManagementContract.deployed();
  console.log("UserManagement address: ", userManagementContract.address);

  // SupplierManagement
  const SupplierManagementFactory = await hre.ethers.getContractFactory("SupplierManagement");
  const supplierManagementContract = await SupplierManagementFactory.deploy(dataStructuresContract.address);
  await supplierManagementContract.deployed();
  console.log("SupplierManagement address: ", supplierManagementContract.address);

  // SupplierManagement2
  const SupplierManagement2Factory = await hre.ethers.getContractFactory("SupplierManagement2");
  const supplierManagement2Contract = await SupplierManagement2Factory.deploy(dataStructuresContract.address);
  await supplierManagement2Contract.deployed();
  console.log("SupplierManagement2 address: ", supplierManagement2Contract.address);

  // OrderManagement
  const OrderManagementFactory = await hre.ethers.getContractFactory("OrderManagement");
  const orderManagementContract = await OrderManagementFactory.deploy(dataStructuresContract.address);
  await orderManagementContract.deployed();
  console.log("OrderManagement address: ", orderManagementContract.address);

  // OrderManagement2
  const OrderManagement2Factory = await hre.ethers.getContractFactory("OrderManagement2");
  const orderManagement2Contract = await OrderManagement2Factory.deploy(dataStructuresContract.address);
  await orderManagement2Contract.deployed();
  console.log("OrderManagement address: ", orderManagement2Contract.address);
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

// const main = async () => {
//     const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';
    
//     const transactionsFactory = await hre.ethers.getContractFactory("Transactions");
//     const transactionsContract = await transactionsFactory.deploy(adminAddress);

//     // const transactionsContract = await transactionsFactory.deploy();
  
//     await transactionsContract.deployed();
  
//     console.log("Transactions address: ", transactionsContract.address);
//   };
  
//   const runMain = async () => {
//     try {
//       await main();
//       process.exit(0);
//     } catch (error) {
//       console.error(error);
//       process.exit(1);
//     }
//   };
  
//   runMain();