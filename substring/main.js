const { Finder } = require("./find");
const { checkedReadFile, countCollisions, createFinder, parseFlags } = require("./setup");

let flags = parseFlags(process.argv);

let string = checkedReadFile(flags.buffer);
let substring = checkedReadFile(flags.query);

let finder = createFinder(flags.algo, substring);

if (flags.time)
  console.time('search');

let indecies = Finder.getIndecies(string, finder, flags.first);

if (flags.time)
  console.timeEnd('search');

if (flags.collisions)
  console.log('collisions: ', countCollisions(string, substring, indecies));

console.log(indecies);