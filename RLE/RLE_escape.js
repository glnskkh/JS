//
// The following program uses escaping symbol to encode string
//

//@ts-check

const ESCAPE_CODE = '#';
const COUNT_MIN = 4; // Otherwise there is no point in RLE

/**
 * @param {String} string
 * @returns String
 */
function RLE_encode(string) {
  if (string.length < 2) {
    return string;
  }

  let count = 1;
  let lastChar = string[0];
  let output = "";

  for (const char of string.slice(1)) {
    if (char == lastChar)
      count++;
    else {
      if (count >= COUNT_MIN || lastChar == ESCAPE_CODE) {
        let countChar =
          String.fromCharCode(
            lastChar == ESCAPE_CODE ? count : count - COUNT_MIN
          );

        output = output
          .concat(ESCAPE_CODE)
          .concat(countChar)
          .concat(lastChar);
      } else {
        for (; count > 0; count--)
          output = output.concat(lastChar);
      }

      count = 1;
    }

    lastChar = char;
  }

  output = output.concat(lastChar);

  return output;
}

/**
 * @param {String} string
 * @returns String
 */
function RLE_decode(string) {
  let output = "";

  for (let i = 0; i < string.length; i++) {
    const char = string[i];

    if (char == ESCAPE_CODE) {
      let countChar = string[++i];
      let count = countChar.charCodeAt(0);

      let char = string[++i];

      count = count + (char == ESCAPE_CODE ? 0 : COUNT_MIN);

      for (; count > 0; count--)
        output = output.concat(char);
    } else {
      output = output.concat(char);
    }
  }

  return output;
}

const fs = require('fs');

let type = process.argv[2];

let is_encoding = type.startsWith('en');
let is_decoding = type.startsWith('de');

if (type == undefined || !(is_encoding || is_decoding)) {
  console.error("you should specify enc|dec mode");
  process.exit(1);
}

const inputFile = process.argv[3];
const outputFile = process.argv[4];

let content = fs.readFileSync(inputFile, 'utf8');

let result = is_encoding ? RLE_encode(content) : RLE_decode(content);

fs.writeFileSync(outputFile, result, 'utf8');
