const { existsSync, readFileSync } = require('fs');
const { Finder, Buffer } = require('./find');
const { Flags } = require('./flags');
const { FindBrute } = require('./brute');
const { hashSum, hashSqSum, hashRK, FindHash } = require("./hash");

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

function createFinder(algo, query) {
  switch (algo) {
    case 'brute':
      return new FindBrute(query);
    case 'hashSum':
      return new FindHash(query, hashSum);
    case 'hashSqSum':
      return new FindHash(query, hashSqSum);
    case 'hashRK':
      return new FindHash(query, hashRK);
    default:
      console.error('there is no such algo!');
      process.exit(-1);
  }
}

function getCollisions(buffer, query, indecies) {
  buffer.flush();

  let bruteFinder = new FindBrute(query);
  let bruteIndecies = Finder.getIndecies(buffer, bruteFinder);

  let collisions = [];
  let i = 0;
  for (let index of indecies) {
    while (bruteIndecies[i] < index)
      ++i;

    if (bruteIndecies[i] != index)
      collisions.push(index);
  }

  return collisions;
}

module.exports = { parseFlags, getBuffer, createFinder, getCollisions };