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

// Print table of occurences
console.log('char\tcount\tp')
for (let i = 0; i < chars.length; i++) {
  let p = (count[i] / contentLen).toPrecision(2);

  console.log(`${chars[i]}\t${count[i]}\t${p}`);
}

// Calculate entropy
let entropy = 0;

if (chars.length == 1)
  console.log(entropy);
else {
  let log =
    process.argv[3] != undefined ?
      parseFloat(process.argv[3]) : chars.length;

  let diffLog = 1 / Math.log2(log);

  for (let i = 0; i < chars.length; i++) {
    let p = count[i] / contentLen;

    entropy += -1 * p * Math.log2(p) * diffLog;
  }

  console.log(entropy.toPrecision(2));
}
