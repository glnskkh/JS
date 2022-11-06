const { Finder } = require("./find");
const { getBuffer, countCollisions, createFinder, parseFlags } = require("./setup");
const { Automata } = require("./auto");

let flags = parseFlags(process.argv);

let buffer = getBuffer(flags.buffer);
let query = getBuffer(flags.query);

let finder = createFinder(flags.algo, query);

if (flags.time) console.time('search');

let indecies = Finder.getIndecies(buffer, finder, flags.first);

if (flags.time) console.timeEnd('search');

if (flags.collisions)
  console.log(`collisions: ${countCollisions(buffer, query, indecies)}`);

if (flags.table && finder instanceof Automata)
  console.log(`table: ${finder.table}`);

console.log(indecies);