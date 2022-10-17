class Binary {
  constructor() {
    this.inner = 0;
  }

  getBit(position) {
    return (this.inner >> position) & 1;
  }

  setZero(position) {
    this.inner &= ~(1 << position)
  }

  setOne(position) {
    this.inner |= 1 << position;
  }

  setBit(position, value) {
    if (!(value == 0 || value == 1))
      console.error(`value should be either 0 or 1 not ${value}`);

    if (value == 0)
      this.setZero(position);
    else
      this.setOne(position);
  }

  insertBit(position) {
    this.inner = (this.getRange(position) << position + 1) | this.getRange(0, position);
  }

  toNumber() {
    return this.inner;
  }

  toString() {
    return Binary.asBits(this).reverse().join('');
  }

  getRange(start, end = this.length()) {
    return (this.inner >> start) % (1 << (end - start));
  }

  static fromNumber(number) {
    let n = new Binary();
    n.inner = number;

    return n;
  }

  static fromString(content) {
    let result = 0;

    for (let i = content.length - 1; i >= 0; --i)
      if (content[i] == '1' || content[i] == '0')
        result <<= 1, result += content[i] - '0';
      else {
        console.error(`cannot build binary from that string: ${content}`);
        return;
      }

    return Binary.fromNumber(result);
  }

  static asBits(number) {
    let inner = 0;

    if (number instanceof Binary)
      inner = number.inner;
    else
      inner = number;

    let bits = [];

    while (inner > 0) {
      bits.push(inner & 1);
      inner >>= 1;
    }

    return bits;
  }

  length() {
    return Binary.asBits(this).length;
  }
}

function insertCodeBits(number) {
  for (let twoPower = 1; twoPower <= number.length(); twoPower *= 2)
    number.insertBit(twoPower - 1);
}

function calculateCodeBits(number) {
  for (let twoPower = 1; twoPower <= number.length(); twoPower *= 2) {
    let xorResult = 0;

    let nextTwoPower = twoPower * 2;
    for (let i = twoPower - 1; i < number.length(); i += nextTwoPower) {
      let range = number
        .getRange(i, i + twoPower);

      let bits = Binary.asBits(range);

      xorResult ^= bits.reduce((a, b) => a ^ b, 0);
    }

    number.setBit(twoPower - 1, xorResult);
  }
}

function hammingEncode(content) {
  let number = Binary.fromString(content);

  insertCodeBits(number);
  // calculateCodeBits(number);

  return { result: number.toString() };
}

function hammingDecode(content) {

}
