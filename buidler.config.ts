import { usePlugin } from  "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-ethers");

const config = {
  defaultNetwork: 'buidlerevm',
  networks: {
    buidlerevm: {
      gasPrice: 0,
      blockGasLimit: 100000000,
    },
    localhost: {
      url: 'http://localhost:8545'
    },
  },
  solc: {
    version: '0.4.24',
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
}

export default config;
