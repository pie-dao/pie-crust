import { usePlugin, task, types } from  "@nomiclabs/buidler/config";
import { ArgumentType } from "@nomiclabs/buidler/internal/core/params/argumentTypes";
import { Crust } from "./typechain/Crust";
import { CrustFactory } from "./typechain/CrustFactory";

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
    frame: {
      url: "http://localhost:1248"
    }
  },
  solc: {
    version: '0.4.24',
    optimizer: {
      enabled: false,
      runs: 200
    }
  },
}

task("deploy-crust", "Deploys the Crust contract")
  .addParam("token0", "token0", null, types.string)
  .addParam("token1", "token1", null, types.string)
  .addParam("name")
  .addParam("symbol")
  .setAction(async (taskArgs, {ethers}) => {
    const signers = await ethers.getSigners();
    const crust: Crust = await (new CrustFactory(signers[0])).deploy(
      [taskArgs.token0, taskArgs.token1],
      taskArgs.name,
      taskArgs.symbol,
      18
    );
    console.log(`Deployed crust at: ${crust.address}`);

    return crust;
});

export default config;
