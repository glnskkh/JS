//
// Following program encodes & decodes text with RLE (jump variant)
//

// @ts-check

const COUNT_MIN = 3;
const BYTE_MAX = (1 << 8) - 1;
const MUL_RANGE = BYTE_MAX / 2;
const SINGLE_RANGE = BYTE_MAX - MUL_RANGE;

/**
 * Encode text with RLE (jumping)
 * @param {String} string
 * @returns String
 */
function RLE_encode(string) {

}

/**
 * Decode text with RLE (jumping)
 * @param {String} string
 * @returns String
 */
function RLE_decode(string) {

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
