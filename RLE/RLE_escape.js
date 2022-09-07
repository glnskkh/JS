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
  // Otherwise there if no point in RLE
  if (string.length < COUNT_MIN) {
    return string;
  }

  // Resulting string
  let output = "";

  for (let i = 0, j = 0; i < string.length; i = j) {
    let currentChar = string[i];

    // Shift j to next different charachter
    j = i + 1;
    while (string[j] == currentChar && j < string.length)
      j++;

    let count = j - i;

    if (count >= COUNT_MIN || currentChar == ESCAPE_CODE) {
      let countChar =
        String.fromCharCode(
          // In case if character is not ESCAPE_CODE:
          // We store (count - COUNT_MIN) instead of count.
          // Just because count >= COUNT_MIN
          currentChar == ESCAPE_CODE ? count : count - COUNT_MIN
        );

      output = output
        .concat(ESCAPE_CODE)
        .concat(countChar)
        .concat(currentChar);
    } else {
      for (; count > 0; count--)
        output = output.concat(currentChar);
    }
  }

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

if (!is_encoding && !is_decoding) {
  console.error("you should specify encode or decode mode");
  process.exit(1);
}

const inputFile = process.argv[3];
const outputFile = process.argv[4];

let content = fs.readFileSync(inputFile, 'utf8');

let result = is_encoding ? RLE_encode(content) : RLE_decode(content);

fs.writeFileSync(outputFile, result, 'utf8');
