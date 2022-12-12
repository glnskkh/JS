class RLEJump {
  static MIN_COUNT = 3;
  static MAX_BYTE = (1 << 8) - 1;

  static MAX_MULTIPLE = Math.floor(this.MAX_BYTE / 2);
  static MAX_SINGLE = this.MAX_BYTE - this.MAX_SINGLE;

  static encode(string) {
    let output = "";
    let offsets = [];

    let cursor = 0;

    let multiple = false;

    while (cursor < string.length) {
      const currentChar = string[cursor];
      let count = 0;

      while (cursor + count < string.length && currentChar == string[cursor + count])
        ++count;

      cursor += count;

      if (count > this.MIN_COUNT || (multiple && offsets.at(-1)[1].length + count > this.MAX_SINGLE)) {
        multiple = true;
        offsets.push([multiple, count]);
        continue;
      }

      if (multiple || offsets.length == 0 || offsets.at(-1)[1].length + count > this.MAX_SINGLE) {
        multiple = false;
        offsets.push([multiple, 0]);
      }

      offsets[offsets.length - 1][1] += count;
    }

    cursor = 0;

    for (let offset of offsets) {
      const [ multiple, count ] = offset;

      if (multiple) {
        output += String.fromCharCode(count - this.MIN_COUNT);
        output += string[cursor];
      } else {
        output += String.fromCharCode(count + this.MAX_MULTIPLE);
        output += string.slice(cursor, cursor + count);
      }

      cursor += count;
    }

    return output;
  }

  /** @param {String} string */
  static decode(string) {
    let output = "";
    let cursor = 0;

    while (cursor < string.length) {
      let count = string[cursor++].charCodeAt(0);

      if (count > this.MAX_BYTE) {
        console.error('error while decoding on char %d', cursor);
        process.exit(-1);
      }

      if (count <= this.MAX_MULTIPLE) {
        count += this.MIN_COUNT;

        const char = string[cursor++];

        while (count-- > 0)
          output += char;
      } else {
        while (count-- > this.MAX_MULTIPLE) {
          const char = string[cursor++];
          output += char;
        }
      }
    }

    return output;
  }

  static test(string) {
    return string == RLEJump.decode(RLEJump.encode(string));
  }
}


const tests = [
  "aaaabcbbbbb",
  "aaaabbbbb12345",
  "12345",
  "abcA",
  ""
];

for (let testCase of tests) {
  console.assert(RLEJump.test(testCase), "%s", testCase);
}


const fs = require('fs');

let type = process.argv[2];

let encoding = type.startsWith('en');
let decoding = type.startsWith('de');

if (!(encoding || decoding)) {
  console.error("you should specify encode or decode mode");
  process.exit(1);
}

const inputFile = process.argv[3];

if (!fs.existsSync(inputFile)) {
  console.error("there is no such file, please specify exsiting one");
  process.exit(1);
}

const outputFile = process.argv[4];

let content = fs.readFileSync(inputFile, 'utf8');

let result = encoding ? RLEJump.encode(content) : RLEJump.decode(content);

fs.writeFileSync(outputFile, result, 'utf8');
