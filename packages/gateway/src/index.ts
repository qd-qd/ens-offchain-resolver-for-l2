import { makeApp } from './server';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { ethers } from 'ethers';
import { JSONDatabase } from './json';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const program = new Command();

program
  .option(
    '-k --private-key <key>',
    'Private key to sign responses with. Prefix with @ to read from a file',
    process.env.PRIVATE_KEY
  )
  .option('-d --data <file>', 'JSON file to read data from', process.env.DATA)
  .option('-t --ttl <number>', 'TTL for signatures', process.env.TTL || '300')
  .option(
    '-p --port <number>',
    'Port number to serve on',
    process.env.PORT || '8080'
  );

program.parse(process.argv);
const options = program.opts();
let privateKey = options.privateKey;
if (privateKey.startsWith('@')) {
  privateKey = ethers.utils.arrayify(
    readFileSync(privateKey.slice(1), { encoding: 'utf-8' })
  );
}
const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);
const db = JSONDatabase.fromFilename(options.data, parseInt(options.ttl));
const app = makeApp(signer, '/', db);

console.log(`Serving on port ${options.port} with signing address ${address}`);
app.listen(parseInt(options.port));

module.exports = app;
