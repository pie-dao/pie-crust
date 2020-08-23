import chai, {expect} from "chai";
import {deployContract, solidity} from "ethereum-waffle";
import {ethers, ethereum} from "@nomiclabs/buidler";
import { Signer, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
// TODO consider moving merkleTree.js and converting it to typescript
import { MiniMeTokenFactory } from "../typechain/MiniMeTokenFactory";
import { MiniMeToken } from "../typechain/MiniMeToken";
import { Crust } from "../typechain/Crust";
import CrustArtifact from "../artifacts/Crust.json";

chai.use(solidity);

let account: string;
let signers: Signer[];
let token0: MiniMeToken;
let token1: MiniMeToken;
let crust: Crust;

describe("VestedTokenMigration", function () {
    before(async() => {
        signers = await ethers.getSigners();
        account = await signers[0].getAddress();
    });

    beforeEach(async() => {
        token0 = await (new MiniMeTokenFactory(signers[0])).deploy(
            constants.AddressZero,
            constants.AddressZero,
            0,
            "TKN0",
            18,
            "TKN0",
            false
        );

        token1 = await (new MiniMeTokenFactory(signers[0])).deploy(
            constants.AddressZero,
            constants.AddressZero,
            0,
            "TKN0",
            18,
            "TKN1",
            true
        );

        crust = await (deployContract(signers[0], CrustArtifact, [[token0.address, token1.address]])) as Crust;
    });

    it("TEST", async() => {
        await token0.generateTokens(account, parseEther("1337"));
    });
});