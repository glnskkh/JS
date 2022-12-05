const { existsSync, readFileSync } = require('fs');
const { Finder, Buffer } = require('./find');
const { Flags } = require('./flags');
const { FindBrute } = require('./brute');
const { hashSum, hashSqSum, hashRK, FindHash } = require("./hash");
const { FindAuto } = require('./auto');
const { FindMur } = require('./mur');

function parseFlags(argv) {
  let flags = new Flags();

  flags.addFlag('time', 't');
  flags.addFlag('collisions', 'c');
  flags.addFlag('table', 'T');
  flags.addParameter('first', 'n', -1);
  flags.addParameter('algo', 'a', 'brute');
  flags.addParameter('buffer', 'b');
  flags.addParameter('query', 'q');

  return flags.parse(argv);
}

function getBuffer(path) {
  if (!existsSync(path)) {
    console.error(`there is no such file ${path}`);
    process.exit(-1);
  }

  let byteBuffer = readFileSync(path);
  let buffer = new Buffer(byteBuffer);

  return buffer;
}

function createFinder(algo, query, check) {
  switch (algo) {
    case 'brute':
      return new FindBrute(query);
    case 'hashSum':
      return new FindHash(query, hashSum, check);
    case 'hashSqSum':
      return new FindHash(query, hashSqSum, check);
    case 'hashRK':
      return new FindHash(query, hashRK, check);
    case 'auto':
      return new FindAuto(query);
    case 'mur':
      return new FindMur(query);
    default:
      console.error('there is no such algo!');
      process.exit(-1);
  }
}

function printAutomataTable(table) {
  console.log('[');

  let c = 0;
  for (let row of table) {
    for (let transition of Object.keys(row)) {
      console.log(`  (${transition}: ${row[transition]})`);
    }
    console.log(`--${c}`);
    ++c;
  }

  console.log(']');
}

module.exports = { parseFlags, getBuffer, createFinder, printAutomataTable };