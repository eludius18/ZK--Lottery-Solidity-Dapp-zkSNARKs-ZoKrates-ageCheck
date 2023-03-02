import { ethers } from "hardhat";

/**
 * 
 * @returns Id where the state will be reverted
 */
export const makeSnapshot = async () => {
  return await ethers.provider.send("evm_snapshot", []);
};

/**
 * 
 * @param block Id for the block to revert
 */
export const snapshot = async (block: number) => {
  await ethers.provider.send("evm_revert", [block]);
};
