const { ethers } = require("hardhat");

// @DEV paste here the address printed by `yarn start:gateway`
const owner = "0x83EAD75c0191c3184CaAd30FF8061e89f9d851a1";

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (!network.config.gatewayurl) {
    throw "gatewayurl is missing on hardhat.config.js";
  }

  await deploy("OffchainResolver", {
    from: deployer,
    args: [network.config.gatewayurl, [owner]],
    log: true,
  });
};

module.exports.tags = ["test", "demo"];
