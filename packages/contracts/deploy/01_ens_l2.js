const { ethers } = require("hardhat");

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const owner = signers[0].address;

  await deploy("L2Registry", {
    from: owner,
    args: [],
    log: true,
  });

  await deploy("L2PublicResolver", {
    from: owner,
    args: [],
    log: true,
  });
};

module.exports.tags = ["test", "l2"];
