import { deployments, ethers, waffle } from "hardhat";
import { Signer } from "ethers";
import { Lottery } from "../../typechain-types/contracts";
import { Deployment } from "hardhat-deploy/dist/types";
import { expect, assert } from "chai";
import { assert } from "hardhat/test-case";
import { makeSnapshot, snapshot } from "./test-helpers/snapshot";
import { expect } from "@openzeppelin/test-helpers";


describe("DutchAuction Test suite", async function () {
    let accounts: Signer[];
    let lotteryDeployment: Deployment;
    let lotteryContract: Lottery;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;
    let miniumPayment:number = 0;
    const provider = waffle.provider;

    before(async function () {
      accounts = await ethers.getSigners();
      owner = accounts[0];
      alice = accounts[1];
      bob = accounts[2];
      lotteryDeployment = await deployments.get("Lottery");
      lotteryContract = await ethers.getContractAt(
        "Lottery",
        lotteryDeployment.address
      );
    });

    describe("Variables Checks", () => {
        it("should initialize with the correct minium payment", async () => {
            const id: number = await makeSnapshot();
            const result = await lotteryContract.getMiniumPayment();
            expect(result).to.equal(miniumPayment);
            snapshot(id);
        });
        it("should allow Owner to change Minium Payment Value", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(owner).changeDefaultMiniumPayment(5);
            const result = await lotteryContract.getMiniumPayment();
            expect(result).to.equal(5);
            snapshot(id);
        });
        it("should allow anyone to get balance in lottery", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 5});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            const lotteryBalance = await lotteryContract.connect(bob).getBalance();
            expect(lotteryBalance).to.equal(10);
            snapshot(id);
        });
        it("should allow Owner to change Select Winner Owner", async () => {
            const id: number = await makeSnapshot();
            const aliceaddress = await alice.getAddress();
            await lotteryContract.connect(owner).changeSelectWinnerOwner(aliceaddress);
            const result = await lotteryContract.getSelectWinnerOwner();
            expect(result).to.equal(aliceaddress);
            snapshot(id);
        });
        it("should allow Owner to change Contract Owner", async () => {
            const id: number = await makeSnapshot();
            const aliceaddress = await alice.getAddress();
            await lotteryContract.connect(owner).changeContractOwner(aliceaddress);
            const result = await lotteryContract.owner();
            expect(result).to.equal(aliceaddress);
            snapshot(id);
        });
    });

    describe("enterLottery function checks", () => {
        it("should allow only values greater than 0", async () => {
            const id: number = await makeSnapshot();
            await expect(lotteryContract.connect(alice).enterLottery({value: 0})).to.revertedWith("You must send Ether to enter the lottery");
            snapshot(id);
        });
        it("shoul not allow amounts of ether that doesn't meet Minium value Payment defined", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(owner).changeDefaultMiniumPayment(5);
            const result = await lotteryContract.getMiniumPayment();
            expect(result).to.equal(5);
            await expect(lotteryContract.connect(alice).enterLottery({value: 1})).to.revertedWith("You must send a Minium amout of Ether");
            snapshot(id);
        });
        it("should not allow to enter ether when the Smart Contract is paused", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(owner).pause();
            await expect(lotteryContract.connect(alice).enterLottery({value: 4})).to.revertedWith("Pausable: paused");
            snapshot(id);
        });
        it("should allow anyone can use enter function", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            snapshot(id);
        });
    });
    describe("selectWinner function checks", () => {
        it("should allow Only to Owner to use selectWinner function", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await expect (lotteryContract.connect(bob).selectWinner()).to.revertedWith("Only selectWinnerOwner");
            snapshot(id);
        });
        it("should send all amount in Lottery Smart Contracts sent to Winner", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await lotteryContract.connect(bob).enterLottery({value: 10});
            await lotteryContract.connect(owner).selectWinner();
            const lotteryBalance = await lotteryContract.connect(owner).getBalance();
            expect(lotteryBalance).to.equal(0);
            snapshot(id);
        });
        it("should allow users can send ether as many times as they want before distributing the prizes", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            await lotteryContract.connect(bob).enterLottery({value: 12});
            await lotteryContract.connect(owner).selectWinner();
            const lotteryBalance = await lotteryContract.connect(owner).getBalance();
            expect(lotteryBalance).to.equal(0);
            snapshot(id);
        });
    });
    describe("Get Functions checks", () => {
        it('should show that getPlayers array includes bob and alice accounts', async () => {
            await lotteryContract.connect(alice).enterLottery({ value: 3 });
            await lotteryContract.connect(bob).enterLottery({ value: 5 });
            const aliceAddress = await alice.getAddress();
            const bobAddress = await bob.getAddress();
            const players = await lotteryContract.getPlayers();
            const playersArray = players.map((p: string) => p.toString());
            const walletsIncluded = playersArray.includes(aliceAddress) && playersArray.includes(bobAddress);
            assert.isTrue(walletsIncluded, 'Both alice and bob addresses should be included in the players array');
        });
        it("should allow anyone to get balance in lottery", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(owner).selectWinner();
            await lotteryContract.connect(alice).enterLottery({value: 5});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            const lotteryBalance = await lotteryContract.connect(bob).getBalance();
            expect(lotteryBalance).to.equal(10);
            snapshot(id);
        });
        it("should allow anyone to get Minium Payment in lottery", async () => {
            const id: number = await makeSnapshot();
            const lotteryBalance = await lotteryContract.connect(owner).getMiniumPayment();
            expect(lotteryBalance).to.equal(miniumPayment);
            snapshot(id);
        });
    });
    describe("Whole Test()", () => {
        describe("Send ether and Select Winner", () => {
            it("should allow Alice to send 3 ether and win the Lottery if its the only who send ether", async () => {
                await lotteryContract.connect(alice).enterLottery({value: 3});
                await lotteryContract.connect(owner).selectWinner();
                const lotteryBalance = await lotteryContract.connect(owner).getBalance();
                expect(lotteryBalance).to.equal(0);
            });
            it("should allow Alice to send 3 ether and Bob to send 5 ether before distributing the prizes", async () => {
                await lotteryContract.connect(alice).enterLottery({value: 3});
                await lotteryContract.connect(bob).enterLottery({value: 5});
                await lotteryContract.connect(owner).selectWinner();
                const lotteryBalance = await lotteryContract.connect(owner).getBalance();
                expect(lotteryBalance).to.equal(0);
            });
        });
    });
});