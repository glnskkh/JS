#!/usr/bin/node

//
// Following program encodes & decodes text with RLE (jump variant)
//

// @ts-check

const COUNT_MIN = 3; // Minimum sequance lenght
const BYTE_MAX = (1 << 8) - 1;

// MUL_RANGE + SIN_RANGE <= BYTE_MAX
const MUL_RANGE = Math.floor(BYTE_MAX / 2);
const SIN_RANGE = BYTE_MAX - MUL_RANGE;

/**
 * Encode text with RLE (jumping)
 * @param {String} string
 * @returns String
 */
function RLE_encode(string) {
  let output = "";
  let buffer = "";

  for (let i = 0, j = 0; i < string.length; i = j) {
    let currentChar = string[i];

    j = i + 1;
    while (string[j] == currentChar && j < string.length)
      j++;

    let count = j - i;

    if (count >= COUNT_MIN) {
      while (buffer.length > 0) {
        let bufferCountChar =
          String.fromCharCode(Math.min(buffer.length, SIN_RANGE));

        output = output
          .concat(bufferCountChar)
          .concat(buffer.substring(0, SIN_RANGE));

        buffer = buffer.slice(SIN_RANGE);
      }

      buffer = "";

      while (count > 0) {
        count -= COUNT_MIN;

        let countChar = String.fromCharCode(Math.min(count, MUL_RANGE));

        output = output
          .concat(countChar)
          .concat(currentChar);

        count -= MUL_RANGE;
      }
    } else {
      for (; count > 0; count--)
        buffer = buffer.concat(currentChar);
    }
  }

  if (0 < buffer.length) {
    while (buffer.length > 0) {
      let bufferCountChar =
        String.fromCharCode((buffer.length % SIN_RANGE) + MUL_RANGE);

      output = output
        .concat(bufferCountChar)
        .concat(buffer.substring(0, SIN_RANGE));

      buffer = buffer.slice(SIN_RANGE);
    }
  }

  return output;
}

/**
 * Decode text with RLE (jumping)
 * @param {String} string
 * @returns String
 */
function RLE_decode(string) {
  let output = "";

  for (let i = 0; i < string.length;) {
    const countChar = string[i++];

    // Get char code of countChar
    let count = countChar.charCodeAt(0);

    if (count <= MUL_RANGE) {
      count += COUNT_MIN;

      const char = string[i++];

      for (; count > 0; count--)
        output = output.concat(char);
    } else {
      count -= MUL_RANGE;

      for (; count > 0; count--) {
        // !!! Shift i
        const char = string[i++];

        output = output.concat(char);
      }
    }
  }

  return output;
}


const fs = require('fs');

// Test
const testString = "aaaabbbbb#12345";
console.log(
  "But tests are ".concat(
    RLE_decode(RLE_encode(testString)) == testString ?
      "VALID" : "INVALID"
  )
)

let type = process.argv[2];

let is_encoding = type.startsWith('en');
let is_decoding = type.startsWith('de');

if (!is_encoding && !is_decoding) {
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

let result = is_encoding ? RLE_encode(content) : RLE_decode(content);

fs.writeFileSync(outputFile, result, 'utf8');
