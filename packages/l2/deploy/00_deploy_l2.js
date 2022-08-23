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
  const registry = await deploy("ENSRegistry", {
    from: owner,
    args: [],
    log: true,
  });

  // deploy the metadata service
  const metadataService = await deploy("StaticMetadataService", {
    from: owner,
    args: ["https://fake-url.com/fake.jpg"],
    log: true,
  });

  // deploy the base registar
  const registar = await deploy("BaseRegistrarImplementation", {
    from: owner,
    args: [registry.address, ethers.utils.namehash("eth")],
    log: true,
  });

  // deploy the name wrapper
  const nameWrapper = await deploy("NameWrapper", {
    from: owner,
    args: [registry.address, registar.address, metadataService.address],
    log: true,
  });

  // deploy the public resolver
  await deploy("PublicResolver", {
    from: owner,
    args: [registry.address, nameWrapper.address],
    log: true,
  });

  // log the address of the registry deployed
  // this address must be copied to the .env file of the gateway package (REGISTRY_ADDRESS)
  console.log(
    "\n\n\x1b[34m\x1b[1m",
    `Registry address -> ${registry.address}`,
    "\x1b[0m\n\n"
  );
};

module.exports.tags = ["deploy-deploy-l2"];
