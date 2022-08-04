const { ethers } = require("hardhat");

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const owner = signers[0].address;

  const registry = await deploy("ENSRegistry", {
    from: owner,
    args: [],
    log: true,
  });

  // log the address of the registry deployed
  // this address must be copied to the .env file of the client package (REGISTRY_ADDRESS)
  console.log(
    "\n\n\x1b[34m\x1b[1m",
    `Registry address -> ${registry.address}`,
    "\x1b[0m\n\n"
  );
};

module.exports.tags = ["test"];
