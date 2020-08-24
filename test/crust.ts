import chai, { expect } from "chai";
import { deployContract, solidity } from "ethereum-waffle";
import { ethers } from "@nomiclabs/buidler";
import { Signer, constants, BigNumber } from "ethers";
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
            "TKN1",
            18,
            "TKN1",
            true
        );

        crust = await (deployContract(signers[0], CrustArtifact, [[token0.address, token1.address]])) as Crust;
    });

    it("Test balance of", async() => {
        await token0.generateTokens(account, parseEther("1337"));
        expect(await crust.balanceOf(account)).to.eq(parseEther("1337"));
        const block1437 = await (await token1.generateTokens(account, parseEther("100"))).blockNumber;
        expect(await crust.balanceOf(account)).to.eq(parseEther("1437"));
        const block1637 = await (await token0.generateTokens(account, parseEther("200"))).blockNumber;
        expect(await crust.balanceOf(account)).to.eq(parseEther("1637"));

        await token1.destroyTokens(account, parseEther("37"));
        expect(await crust.balanceOf(account)).to.eq(parseEther("1600"));
        await token0.destroyTokens(account, parseEther("150"));
        expect(await crust.balanceOf(account)).to.eq(parseEther("1450"));

        expect(await crust.balanceOfAt(account, block1437)).to.eq(parseEther("1437"));
        expect(await crust.balanceOfAt(account, block1637)).to.eq(parseEther("1637"));
    });
    it("Test balance of edge case", async() => {
        // MOTIVATION:
        // uint256 max is 2.pow(256) - 1
        // 2.pow(255) is half of 2.pow(256)
        // 2 * 2.pow(255) will overflow uint256 max by 1
        // NOTE: when creating this test. noticed 2.pow(128) - 1 is max value (uint128)
        // Issue is already known: https://github.com/Giveth/minime/issues/60
        // INFO: MAX VALUE of crust is 2 * uint128 = uint129-1
        const bigboi128 = BigNumber.from(2).pow(128).sub(1);
        await token0.generateTokens(account, bigboi128);
        expect(await crust.balanceOf(account)).to.eq(bigboi128);
        // this will create overflow
        await expect(token0.generateTokens(account, 1)).to.be.reverted;
        expect(await crust.balanceOf(account)).to.eq(bigboi128);

        await token1.generateTokens(account, bigboi128);
        // this will create overflow
        await expect(token1.generateTokens(account, 1)).to.be.reverted;
        expect(await crust.balanceOf(account)).to.eq(bigboi128.add(bigboi128));
    });
    it("Test total supply", async() => {
        // token actions from account 0
        await token0.generateTokens(account, parseEther("100"));
        expect(await crust.totalSupply()).to.eq(parseEther("100"));
        await token1.generateTokens(account, parseEther("50"));
        expect(await crust.totalSupply()).to.eq(parseEther("150"));
        const block125 = await (await token0.destroyTokens(account, parseEther("25"))).blockNumber;
        expect(await crust.totalSupply()).to.eq(parseEther("125"));

        // create tokens from other accounts
        await token0.generateTokens(await signers[1].getAddress(), parseEther("100"));
        await token1.generateTokens(await signers[2].getAddress(), parseEther("100"));
        const block425 = await (await token0.generateTokens(await signers[2].getAddress(), parseEther("100"))).blockNumber;
        await token1.generateTokens(await signers[3].getAddress(), parseEther("100"));

        expect(await crust.totalSupply()).to.eq(parseEther("525"));

        // destroy some
        await token1.destroyTokens(await signers[2].getAddress(), parseEther("25"));
        await token1.destroyTokens(await signers[3].getAddress(), parseEther("30"));

        expect(await crust.totalSupply()).to.eq(parseEther("470"));
        expect(await crust.totalSupplyAt(block125)).to.eq(parseEther("125"));
        expect(await crust.totalSupplyAt(block425)).to.eq(parseEther("425"));
    });
    it("Test total supply edge case", async() => {
        const bigboi128 = BigNumber.from(2).pow(128).sub(1);
        await token0.generateTokens(account, bigboi128);
        expect(await crust.totalSupply()).to.eq(bigboi128);
        await token1.generateTokens(account, bigboi128);
        expect(await crust.totalSupply()).to.eq(bigboi128.mul(2));

        // the total supply is also uint128 :thinking_face:
        await expect(token0.generateTokens(await signers[1].getAddress(), 1)).to.be.reverted;
    });
});