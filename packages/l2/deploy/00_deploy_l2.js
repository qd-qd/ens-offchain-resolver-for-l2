const { ethers } = require("hardhat");

/*
 ** This script deploy the registry, the metadata service, the
 ** registrar, the name wrapper and the public resolver.
 */
module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const owner = signers[0].address;

  // deploy the registry
  const registry = await deploy("L2Registry", {
    from: owner,
    args: [],
    log: true,
  });

  // deploy the metadata service
  const metadataService = await deploy("L2StaticMetadataService", {
    from: owner,
    args: ["https://fake-url.com/fake.jpg"],
    log: true,
  });

  // deploy the base registar
  const registar = await deploy("L2BaseRegistar", {
    from: owner,
    args: [registry.address, ethers.utils.namehash("eth")],
    log: true,
  });

  // deploy the name wrapper
  const nameWrapper = await deploy("L2NameWrapper", {
    from: owner,
    args: [registry.address, registar.address, metadataService.address],
    log: true,
  });

  // deploy the public resolver
  await deploy("L2PublicResolver", {
    from: owner,
    args: [registry.address, nameWrapper.address],
    log: true,
  });
};

module.exports.tags = ["deploy-deploy-l2"];
