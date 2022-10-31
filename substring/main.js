const { Finder } = require("./find");
const { checkedReadFile, countCollisions, createFinder, parseFlags } = require("./setup");

let flags = parseFlags(process.argv);

let string = checkedReadFile(flags['-b']);
let substring = checkedReadFile(flags['-q']);

let finder = createFinder(flags['-a'], string, substring);

if (flags['-t'])
  console.time('search');

let indecies = Finder.get(finder, flags['-n']);

if (flags['-t'])
  console.timeEnd('search');

if (flags['-c'])
  console.log('collisions: ', countCollisions(string, substring, indecies));

console.log(indecies);