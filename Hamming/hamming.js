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
  for (let i = 1; i <= number.length(); i <<= 1)
    number.insertBit(i - 1);
}

function calculateCodeBits(number) {
  for (let i = 1; i <= number.length(); i <<= 1) {
    let xorResult = 0;

    let d = i << 1;
    for (let j = 0; j < number.length(); j += d) {
      let range = number
        .getRange(i - 1 + j, i - 1 + (j + i))

      let bits = Binary.asBits(range);

      xorResult ^= bits.reduce((a, b) => a ^ b, 1);
    }

    number.setBit(i - 1, xorResult);
  }
}

function hammingEncode(content) {
  let number = Binary.fromString(content);

  insertCodeBits(number);
  calculateCodeBits(number);

  return { result: number.toString() };
}

function hammingDecode(content) {

}
