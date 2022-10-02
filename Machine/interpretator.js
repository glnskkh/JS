const perform = {
  get: (address) => {
    let index, value;

    address = String(address);

    if (address.startsWith("$")) {
      index = Number(address.replace("$", ""));
      value = Number(process.argv[index]);
    } else if (address.startsWith("\'")) {
      index = Number(address.replace("\'", ""));
      value = mem[index];
    } else if (address.match(/[0-9]+/)) {
      value = Number(address);
    }

    return { value, index };
  },
  set: (addressTo, addressFrom) => {
    let indexTo = perform.get(addressTo).index;
    let valueFrom = perform.get(addressFrom).value;

    mem[indexTo] = valueFrom;
  },
  mov: (addressTo, addressFrom) => {
    let indexTo = perform.get(addressTo).index;

    while (!(indexTo < mem.length))
      mem.push(0);

    perform.set(addressTo, addressFrom);
  },
  add: (addressTo, addressFrom) => {
    let valueTo = perform.get(addressTo).value;
    let valueFrom = perform.get(addressFrom).value;

    perform.set(addressTo, valueTo + valueFrom);
  },
  sub: (addressTo, addressFrom) => {
    let valueTo = perform.get(addressTo).value;
    let valueFrom = perform.get(addressFrom).value;

    perform.set(addressTo, valueTo - valueFrom);
  },
  put: (address) => {
    console.log(perform.get(address).value);
  },
  jgz: (address, label) => {
    let value = perform.get(address).value;

    if (value > 0)
      perform.jmp(label);
  },
  jlz: (address, label) => {
    let value = perform.get(address).value;

    if (value < 0)
      perform.jmp(label);
  },
  jez: (address, label) => {
    let value = perform.get(address).value;

    if (value == 0)
      perform.jmp(label);
  },
  jnz: (address, label) => {
    let value = perform.get(address).value;

    if (value != 0)
      perform.jmp(label);
  },
  jmp: (label) => {
    currentCommand = labelTable[label];
  },
  cmp: (addressA, addressB, addressTo) => {
    let a = perform.get(addressA).value;
    let b = perform.get(addressB).value;

    if (a > b)
      perform.mov(addressTo, "1");
    else if (a < b)
      perform.mov(addressTo, "-1");
    else
      perform.mov(addressTo, "0");
  },
}

function preprocess(program) {
  let lines = program.split('\n');

  let labelTable = {};
  let plainProgram = [];

  for (let line of lines) {
    let words = [];

    for (let word of line.trim().split(' ')) {
      if (word == '')
        break;

      words.push(word);
    }

    if (words.length == 0)
      continue;

    let word = words[0];

    if (word == '' || word.startsWith("#")) // Empty line
      continue;

    if (word.endsWith(":")) {  // This word is label
      let label = word.replace(":", "");
      labelTable[label] = plainProgram.length;

      continue;
    }

    plainProgram.push(words);
  }

  return { plainProgram, labelTable };
}

const fs = require('fs');

let programFile = process.argv[2];

if (!fs.existsSync(programFile)) {
  console.log('please specify exsisting file');
  process.exit(1);
}

let programText = fs.readFileSync(programFile, 'utf8');

let mem = [];

let { plainProgram, labelTable } = preprocess(programText);

let currentCommand = 0;

while (currentCommand != plainProgram.length) {
  let line = plainProgram[currentCommand++];

  let [command, ...args] = line;

  perform[command](...args);
}