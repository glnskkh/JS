// @ts-check

class Alphabet {
  /**
   * @param {String} baseChar
   * @param {Number} cardinality
   */
  constructor (baseChar, cardinality) {
    this.baseChar = baseChar;
    this.cardinality = cardinality;
  }

  /**
   * @param {String} char
   */
  position(char) {
    return char.charCodeAt(0) - this.baseChar.charCodeAt(0);
  }

  /**
   * @param {String} char
   */
  belong(char) {
    const code = this.position(char);

    return 0 <= code && code < this.cardinality;
  }

  /**
   * @param {Number} code
   */
  char(code) {
    return String.fromCharCode(code + this.baseChar.charCodeAt(0));
  }

  /**
   * @param {String} char1
   * @param {String} char2
   */
  addChars(char1, char2) {
    if (!(this.belong(char1) && this.belong(char2))) {
      console.error('cannot add %s and %s', char1, char2);
      process.exit(-1);
    }

    let code1 = this.position(char1);
    let code2 = this.position(char2);

    let sum = (code1 + code2) % this.cardinality;

    return this.char(sum);
  }

  /**
   * @param {String} char1
   * @param {String} char2
   */
  subChars(char1, char2) {
    if (!(this.belong(char1) && this.belong(char2))) {
      console.error('cannot add %s and %s', char1, char2);
      process.exit(-1);
    }

    let code1 = this.position(char1);
    let code2 = this.position(char2);

    let sub = (this.cardinality + code1 - code2) % this.cardinality;

    return this.char(sub);
  }
}

const ALPHABETS = {
  "en": new Alphabet('a', 26),
  "ru": new Alphabet('а', 32),
};

class Vigenere {
  /**
   * @param {String} text
   * @param {Alphabet} alphabet
   */
  constructor(text, alphabet) {
    this.text = text.toLowerCase();
    this.alphabet = alphabet;
  }

  /**
   * @param {String} key
   * @param {String} func
   */
  perform(key, func) {
    let textCursor = 0;
    let keyCursor = 0;

    let output = "";

    while (textCursor < this.text.length) {
      let char = this.text[textCursor];

      if (this.alphabet.belong(char))
        char = this.alphabet[func](char, key[(keyCursor++) % key.length]);

      output += char;
      ++textCursor;
    }

    return output;
  }

  /** @returns {String} */
  filter() {
    let output = '';

    for (const char of this.text)
      if (this.alphabet.belong(char))
        output += char;

    return output;
  }

  /**
   * @param {String} nativeText
   */
  crack(nativeText) {
    const countChars = (/** @type {String} */ text) => {
      let count = {};

      for (const char of text)
        count[char] = (count[char] || 0) + 1;

      return count;
    };

    const indexOfCoincidence = (/** @type {String} */ text) => {
      let count = countChars(text);

      let n = 0, total = 0;

      for (let char of Object.keys(count)) {
        n += count[char] * (count[char] - 1);
        total += count[char];
      }

      let index = this.alphabet.cardinality * n / (total * (total - 1));

      return index;
    };

    const computeKeyLength = (/** @type {String} */ filtredText) => {
      let found = false;
      let period = 0;
      let slices = [];

      while (!found) {
        ++period;

        slices = [];

        for (let i = 0; i < filtredText.length; ++i)
          slices.push("");

        for (let i = 0; i < filtredText.length; ++i)
          slices[i % period] += filtredText[i];

        let sum = 0;

        for (let i = 0; i < period; ++i)
          sum += indexOfCoincidence(slices[i]);

        let indexOfCoincidenceVal = sum / period;

        if (indexOfCoincidenceVal > 1.6)
          found = true;
      }

      return { period, slices };
    };

    const crackKey = (/** @type {String} */ nativeText) => {

    }

    let filtredText = this.filter();

    let keyLength = computeKeyLength(filtredText);

    let key = crackKey();
  }
}


const { readFileSync, writeFileSync } = require("fs");

let filePath = "alice-in-wonderland.txt";
let key = "helloworldhhhhello";

let text = readFileSync(filePath, 'utf8');

let v1 = new Vigenere(text, ALPHABETS.en);

let encoded = v1.perform(key, "addChars");

writeFileSync("out.txt", encoded);

let v2 = new Vigenere(encoded, ALPHABETS.en);

v2.crack(text);