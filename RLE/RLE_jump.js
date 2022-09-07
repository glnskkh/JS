//
// Following program encodes & decodes text with RLE (jump variant)
//

// @ts-check

const COUNT_MIN = 3;
const BYTE_MAX = 1 << 8 - 1;
const MUL_RANGE = BYTE_MAX / 2;
const SINGLE_RANGE = BYTE_MAX - MUL_RANGE;

/**
 * Encode text with RLE (jumping)
 * @param {String} string
 * @returns String
 */
function RLE_encode(string) {

}
