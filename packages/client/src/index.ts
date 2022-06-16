import { Command } from 'commander';
import ethers from 'ethers';

const program = new Command();
program
  .requiredOption('-r --registry <address>', 'ENS registry address')
  .option('-p --provider <url>', 'web3 provider URL', 'http://localhost:8545/')
  .option('-i --chainId <chainId>', 'chainId', '31337')
  .option('-n --chainName <name>', 'chainName', 'unknown')
  .argument('<name>');

program.parse(process.argv);
const options = program.opts();
const ensAddress = options.registry;
const chainId = parseInt(options.chainId);
const chainName = options.chainName;
const provider = new ethers.providers.JsonRpcProvider(options.provider, {
  chainId,
  name: chainName,
  ensAddress,
});

(async () => {
  const [name] = program.args;
  let [resolver, resolveName] = await Promise.all([
    provider.getResolver(name),
    provider.resolveName(name),
  ]);
  if (resolver) {
    console.log(`resolver address ${resolver.address}`);
    console.log(`eth address ${resolveName}`);
  }
})();
