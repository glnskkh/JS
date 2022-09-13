const fs = require('fs');

let fileName = process.argv[2];

let content = fs.readFileSync(fileName, 'utf8');

let chars = [];
let count = [];

let contentLen = content.length;

for (let i = 0; i < content.length; i++) {
  const char = content[i];

  let index = chars.indexOf(char);

  if (index == -1) {
    // if it is not in list
    chars.push(char);
    count.push(0);


    index = chars.length - 1;
  }

  count[index]++;
}

// Calculate entropy
let entropy = 0;

let log =
  process.argv[3] != undefined ?
    parseFloat(process.argv[3]) :
    (chars.length == 1 ? 2 : chars.length);

let diffLog = 1 / Math.log2(log);

for (let i = 0; i < chars.length; i++) {
  let p = count[i] / contentLen;

  entropy += -1 * p * Math.log2(p) * diffLog;
}

console.log(entropy.toPrecision(2));
