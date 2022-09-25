// @ts-check

const fs = require('fs');

let fileName = process.argv[2];

let program = fs.readFileSync(fileName, 'utf8');
run(program);

/**
 * @param {string} program
 */
function run(program) {
  let mem = [];

  let { normProgram, labelTable } = unlabel(program);
  let flags = {
    Eq: 0,
    Gr: 0,
    Le: 0
  }

  let curCommand = 0;

  const perform = {
    get: (/** @type {string} */ value) => {
      let index;

      if (value.startsWith("$")) {
        index = Number(value.replace("$", ""));

        return { index: Number(process.argv[index]), type: "arg" };
      } else if (value.startsWith("\'")) {
        index = Number(value.replace("\'", ""));

        return { index, type: "addr" };
      } else if (value.match(/[0-9]+/)) {
        index = Number(value);

        return { index, type: "num" };
      } else {
        index = flags[value];

        return { index, type: "flag" };
      }

    },
    mov: (to, from) => {
      let toIndex = perform.get(to).index;

      while (toIndex >= mem.length)
        mem.push(0);

      let f = perform.get(from);
      let fromValue = f.type == "addr" ? mem[f.index] : f.index;

      mem[toIndex] = fromValue;
    },
    add: (to, from) => {
      let toIndex = perform.get(to).index;

      let f = perform.get(from);
      let fromValue = f.type == "addr" ? mem[f.index] : f.index;

      mem[toIndex] += fromValue;
    },
    sub: (to, from) => {
      let toIndex = perform.get(to).index;

      let f = perform.get(from);
      let fromValue = f.type == "addr" ? mem[f.index] : f.index;

      mem[toIndex] -= fromValue;
    },
    put: (value) => console.log(mem[perform.get(value).index]),
    jgz: (value, label) => {
      let v = perform.get(value);

      let b = v.type == "addr" ? mem[v.index] : v.index;

      if (b > 0) curCommand = labelTable[label];
    },
    cmp: (a, b) => {
      let ai = perform.get(a);
      let bi = perform.get(b);

      let av = ai.type == "addr" ? mem[ai.index] : ai.index;
      let bv = bi.type == "addr" ? mem[bi.index] : bi.index;

      if (av > bv)
        flags.Eq = 0, flags.Le = 0, flags.Gr = 1;
      if (av == bv)
        flags.Eq = 1, flags.Le = 0, flags.Gr = 0;
      if (av < bv)
        flags.Eq = 0, flags.Le = 1, flags.Gr = 0;
    },
    jez: (value, label) => {
      let v = perform.get(value);

      let b = v.type == "addr" ? mem[v.index] : v.index;

      if (b == 0) curCommand = labelTable[label];
    },
    jmp: (label) => { curCommand = labelTable[label]; }
  }

  while (curCommand != normProgram.length) {
    let line = normProgram[curCommand];

    let command = line[0];
    let args = line.slice(1);

    curCommand += 1;

    perform[command](...args);
  }
}

function unlabel(program) {
  let lines = program.split('\n');

  let labelTable = {};
  let normProgram = [];

  for (let line of lines) {
    let words = line.trim().split(' ');

    if (words.length == 0)
      continue;

    let word = words[0];

    if (word == '') // Empty line
      continue;

    if (word.startsWith("#")) // The rest of line is comment
      continue;

    if (word.endsWith(":")) {  // This word is label
      let label = word.replace(":", "");

      labelTable[label] = normProgram.length;

      continue;
    }

    normProgram.push(words);
  }

  return { normProgram, labelTable }
}