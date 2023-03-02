import { ethers } from "hardhat";

/**
 *
 * @returns The last block number
 */
export const latestBlock = async (): Promise<number> => {
  return await ethers.provider.getBlockNumber();
};

/**
 *
 * @returns The last block timestamp
 */
export const latestBlockTimestamp = async (): Promise<number> => {
  return (await ethers.provider.getBlock(`latest`)).timestamp;
};

/**
 *
 * @param blocks that will be mined
 */
export const advanceBlock = async () => {
  await ethers.provider.send("evm_mine", []);
};

/**
 *
 * @param blocks that will be mined
 */
export const advanceBlocks = async (blocks: number) => {
  for (let i = 0; i < blocks; i++) {
    await ethers.provider.send("evm_mine", []);
  }
};

/**
 *
 * @param target Block target to advance
 */
export const advanceBlocksTo = async (target: number) => {
  const start: number = Date.now();
  let notified: boolean = false;
  if ((await latestBlock()) > target)
    throw Error(
      `Target block #(${target}) is lower than current block #(${latestBlock})`
    );
  while ((await latestBlock()) < target) {
    if (!notified && Date.now() - start >= 5000) {
      notified = true;
      console.log(
        "%cWARNING: advanceBlockTo: Advancing too many blocks is causing this test to be slow.",
        "color: yellow"
      );
    }
    await advanceBlock();
  }
};

/**
 *
 * @param seconds Number of seconds to increase the next block
 */
export const increaseTime = async (seconds: number) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  advanceBlock();
};

/**
 *
 * @param seconds Number of seconds to increase the next block
 */
export const increaseTimeTo = async (target: number) => {
  const now: number = await latestBlockTimestamp();
  if (target < now)
    throw Error(
      `Cannot increase current time (${now}) to a moment in the past (${target})`
    );
  const diff = target - now;
  increaseTime(diff);
};
