require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: ['2defdd7833f34dbeb1eaaa41070833730b86b77decb7e76e5f3c166c8cb47968'],
    },
  },
};