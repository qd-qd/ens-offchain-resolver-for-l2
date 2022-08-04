require("dotenv").config({ path: "./.env" });

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (!network.config.gatewayurl) {
    throw "gatewayurl is missing on hardhat.config.js";
  }
  if (!process.env.SIGNER) {
    throw "signer address is missing as an environment variable";
  }

  await deploy("OffchainResolver", {
    from: deployer,
    args: [network.config.gatewayurl, [process.env.SIGNER]],
    log: true,
  });
};

module.exports.tags = ["test", "demo"];
