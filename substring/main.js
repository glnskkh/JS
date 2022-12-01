const { Finder } = require("./find");
const { getBuffer, createFinder, parseFlags, printAutomataTable } = require("./setup");

let flags = parseFlags(process.argv);

let buffer = getBuffer(flags.buffer);
let query = getBuffer(flags.query);

let finder = createFinder(flags.algo, query, flags.collisions);

if (flags.time) console.time('search');

let indecies = Finder.getIndecies(buffer, finder, flags.first);

if (flags.time) console.timeEnd('search');

if (flags.table && flags.algo == 'auto')
  printAutomataTable(finder.table.transitions);

console.log(indecies);