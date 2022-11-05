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
  flags.addParameter('-b', '');
  flags.addParameter('-q', '');

  return flags.parse(argv);
}

function checkedReadFile(path) {
  if (!existsSync(path)) {
    console.error(`there is no such file ${path}`);
    process.exit(-1);
  }

  return readFileSync(path, 'utf8');
}

function createFinder(algo, substring) {
  switch (algo) {
    case 'brute':
      return new FindBrute(substring);
    case 'hashSum':
      return new FindHash(substring, hashSum);
    case 'hashSqSum':
      return new FindHash(substring, hashSqSum);
    case 'hashRK':
      return new FindHash(substring, hashRK);
    default:
      console.error('there is no such algo!');
      process.exit(-1);
  }
}

function countCollisions(string, substring, indecies) {
  let bruteFinder = new FindBrute(substring);
  let bruteIndecies = Finder.getIndecies(string, bruteFinder);

  let collisions = 0;
  let i = 0;
  for (let index of indecies) {
    while (bruteIndecies[i] < index)
      ++i;

    if (bruteIndecies[i] != index)
      ++collisions;
  }

  return collisions;
}

module.exports = { parseFlags, checkedReadFile, createFinder, countCollisions };