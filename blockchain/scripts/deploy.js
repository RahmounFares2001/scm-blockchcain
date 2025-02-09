const main = async () => {
    const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';

    const transactionsFactory = await hre.ethers.getContractFactory("Transactions");
    const transactionsContract = await transactionsFactory.deploy(adminAddress);

    // const transactionsContract = await transactionsFactory.deploy();
  
    await transactionsContract.deployed();
  
    console.log("Transactions address: ", transactionsContract.address);
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