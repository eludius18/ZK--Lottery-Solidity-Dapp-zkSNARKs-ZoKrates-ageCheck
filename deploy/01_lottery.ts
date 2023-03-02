import { ethers, run } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { constants } from "ethers";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const miniumPayment = 0;
  const selectWinnerOwner = deployer;

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: [],
    log: true,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            miniumPayment,
            selectWinnerOwner
          ],
        },
      },
    },
    waitConfirmations: 10,
  });

  console.log("Lottery deployed at: ", lottery.address);
  await delay(5000);
  const lotteryImpl = await deployments.get("Lottery_Implementation");
  
  
  await run("verify:verify", {
    address: lotteryImpl.address,
    contract: "contracts/Lottery.sol:Lottery",
  });
  
};

deploy.tags = ["Lottery"];
export default deploy;