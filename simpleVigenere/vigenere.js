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
    this.text = text;
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

  /**
   * @param {String} nativeText
   */
  crack(nativeText) {

  }
}

let v = new Vigenere("hello world", ALPHABETS.en);
