# Pie Crust

Pie Crust allows multiple tokens to be used in a single Aragon voting app. In the current version each token has the same weight and results from the ``crumbs``(tokens in the crust) are simply added together.

The Pie Crust combines the following functions of multiple MiniMe tokens into one.

- ``balanceOf(address _account)``
- ``balanceOfAt(address _account, uint256 block)``
- ``totalSupply()``
- ``totalSupplyAt(uint256 _block)``

## Requirements

We require the following dependencies to be installed on your machine

- node tested with 12.18.3
- yarn tested with 1.22.4
- frame tested with 0.3.1 (currently broken on Windows 10)

## Get started developing

Run the following commands to get started.
```
yarn
yarn build
yarn test
yarn coverage
```

## Deploy a Pie Crust

There is currently only a buidler task to deploy a crust containing 2 tokens but this can easily be adapted to create multi ``crumb`` crusts. Be aware that making a Pie Crust with a lot might significantly increase gas usage which can potentially break your Aragon DAO.

To deploy a pie-crust run the following command:

```
npx buidler deploy-crust --token0 [TOKEN_0_ADDRESS] --token1 [TOKEN_1_ADDRESS] --name [CRUST_NAME] --symbol [CRUST_SYMBOL] --network frame
```