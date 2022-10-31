const { existsSync, readFileSync } = require('fs');
const { FindBrute } = require('./brute');
const { Finder } = require('./find');
const { Flags } = require('./flags');
const { hashSum, hashSqSum, hashRK, FindHash } = require("./hash");

function parseFlags(argv) {
  let flags = new Flags();

  flags.addFlag('-t');
  flags.addFlag('-c');
  flags.addParameter('-n', -1);
  flags.addParameter('-a', 'brute');
  flags.addParameter('-b', '1.txt');
  flags.addParameter('-q', '1.txt');

  return flags.parse(argv);
}

function checkedReadFile(path) {
  if (!existsSync(path)) {
    console.error(`there is no such file ${path}`);
    process.exit(-1);
  }

  return readFileSync(path, 'utf8');
}

function createFinder(algo, string, substring) {
  switch (algo) {
    case 'brute':
      return new FindBrute(string, substring);
    case 'hashSum':
      return new FindHash(string, substring, hashSum);
    case 'hashSqSum':
      return new FindHash(string, substring, hashSqSum);
    case 'hashRK':
      return new FindHash(string, substring, hashRK);
    default:
      console.error('there is no such algo!');
      process.exit(-1);
  }
}

function countCollisions(string, substring, indecies) {
  let bruteIndecies = Finder.get(new FindBrute(string, substring));

  let collisions = 0;
  let i = 0;
  for (let index of indecies) {
    while (bruteIndecies[i] < index)
      ++i;

    if (bruteIndecies[i] != index)
      ++collisions;
  }

  return collisions
}

module.exports = { parseFlags, checkedReadFile, createFinder, countCollisions };