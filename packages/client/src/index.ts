import { Command } from 'commander';
import ethers from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const program = new Command();
program
  .option('-p --provider <url>', 'web3 provider URL', 'http://localhost:8001/')
  .option('-i --chainId <chainId>', 'chainId', '11111')
  .option('-n --chainName <name>', 'chainName', 'unknown')
  .argument('<name>');

program.parse(process.argv);
const options = program.opts();
const ensAddress = process.env.REGISTRY_ADDRESS;
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
