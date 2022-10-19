class Binary {
  constructor(inner = 0, length = 0) {
    this.inner = inner;
    this.length = length;
  }

  getBit(position) {
    return (this.inner >> position) & 1;
  }

  getRange(start, end = this.length) {
    return (this.inner >> start) % (1 << (end - start));
  }

  setZero(position) {
    this.inner &= ~(1 << position)

    if (position >= this.length)
      this.length = position + 1;
  }

  setOne(position) {
    this.inner |= 1 << position;

    if (position >= this.length)
      this.length = position + 1;
  }

  setBit(position, value) {
    if (!(value == 0 || value == 1)) {
      console.error(`value should be either 0 or 1 not ${value}`);
      return;
    }

    if (value == 0)
      this.setZero(position);
    else
      this.setOne(position);
  }

  invertBit(position) {
    this.setBit(position, this.getBit(position) ^ 1);
  }

  unshiftBit(value) {
    this.setBit(this.length, value);
  }

  pushBit(value) {
    if (!(value == 0 || value == 1)) {
      console.error(`value should be either 0 or 1 not ${value}`);
      return;
    }

    this.inner = (this.inner << 1) | value;

    this.length++;
  }

  popBit() {
    if (this.length == 0) {
      console.error("there isn`t any values to pop");
      return;
    }

    let result = this.inner & 1;

    this.inner >>= 1;
    this.length--;

    return result;
  }

  insertBit(position) {
    this.inner =
      (this.getRange(position) << position + 1) |
      this.getRange(0, position);

    this.length++;
  }

  toNumber() {
    return this.inner;
  }

  toString() {
    return Binary.asBits(this)
      .reverse()
      .join('')
      .padStart(this.length, '0');
  }

  static copy(number) {
    let n = new Binary(
      number.inner,
      number.length
    );

    return n;
  }

  static fromNumber(n) {
    let number = new Binary(n, 0);

    while (n > 0) {
      n >>= 1;
      number.length++;
    }

    return number;
  }

  static fromString(content) {
    let number = new Binary();

    for (let char of content)
      if (char == '1' || char == '0')
        number.pushBit(char - '0');
      else {
        console.error(`cannot build binary from that string: ${content}`);
        return;
      }

    return number;
  }

  static wrapTo(number) {
    let result;

    if (number instanceof Binary)
      result = number;
    else if (typeof number == 'number')
      result = Binary.fromNumber(number);
    else {
      console.error(`value should be either Binary or Number, not ${typeof number}`);
      return;
    }

    return result;
  }

  static asBits(n) {
    let number = Binary.wrapTo(n);

    let bits = [];

    while (number.length > 0)
      bits.push(number.popBit());

    return bits;
  }
}

function insertCodeBits(number) {
  for (let twoPower = 1; twoPower <= number.length; twoPower *= 2)
    number.insertBit(twoPower - 1);
}

function calculateCodeBits(number) {
  for (let twoPower = 1;
    twoPower <= number.length;
    twoPower *= 2) {
    let xorResult = 0;

    let nextTwoPower = twoPower * 2;
    for (let i = twoPower - 1;
      i < number.length;
      i += nextTwoPower) {
      let range = number
        .getRange(i, i + twoPower);

      let bits = Binary.asBits(range);

      xorResult ^= bits.reduce((a, b) => a ^ b, 0);
    }

    number.setBit(twoPower - 1, xorResult);
  }
}

function getCodeBits(number) {
  let result = new Binary();

  for (let twoPower = 1;
    twoPower < number.length;
    twoPower *= 2)
    result.unshiftBit(number.getBit(twoPower - 1));

  return result;
}

function getNonCodeBits(number) {
  let result = new Binary();

  for (let twoPower = 1, j = 0; j < number.length; ++j) {
    if (j == twoPower - 1) {
      twoPower *= 2;
      continue;
    }

    result.unshiftBit(number.getBit(j));
  }

  return result;
}

function hammingEncode(content) {
  let number = Binary.fromString(content);

  insertCodeBits(number);
  calculateCodeBits(number);

  return { result: number.toString() };
}

function hammingDecode(content) {
  let number = Binary.fromString(content);

  calculateCodeBits(number);

  let code = getCodeBits(number).toNumber();

  let error;
  if (code > 0) {
    error = `there was an error in ${code} bit (and was corrected)`;
    number.invertBit(code - 1);
  }

  let result = getNonCodeBits(number);

  return { result: result.toString(), error };
}
