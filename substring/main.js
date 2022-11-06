const { Finder } = require("./find");
const { getBuffer, createFinder, parseFlags, getCollisions } = require("./setup");

let flags = parseFlags(process.argv);

let buffer = getBuffer(flags.buffer);
let query = getBuffer(flags.query);

let finder = createFinder(flags.algo, query);

if (flags.time) console.time('search');

let indecies = Finder.getIndecies(buffer, finder, flags.first);

if (flags.time) console.timeEnd('search');

if (flags.collisions)
  console.log(`collisions: ${getCollisions(buffer, query, indecies)}`);

console.log(indecies);