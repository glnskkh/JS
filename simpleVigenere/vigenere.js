// @ts-check

class Alphabet {
  /**
   * @param {String} baseChar
   * @param {Number} cardinality
   */
  constructor(baseChar, cardinality) {
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
   * @param {String} text
   * @returns {String}
   * */
  filter(text) {
    let output = '';

    for (const char of text)
      if (this.belong(char))
        output += char;

    return output;
  }

  /**
   * @param {String} char
   * @param {Number} shift
   * @returns {String}
   */
  shift(char, shift) {
    if (!this.belong(char)) {
      console.error('cannot shift char %s', char);
      process.exit(-1);
    }

    let code = this.position(char);

    let newCode = (code + shift) % this.cardinality;

    return this.char(newCode);
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

class Chars {
  /**
   * @param {Object} counter
   */
  constructor(counter) {
    this.count = counter;
    this.chars = Object.keys(counter)
  }

  /**
   * @param {String} text
   * @returns {Chars}
   */
  static count(text) {
    let counter = {};

    for (const char of text)
      counter[char] = (counter[char] || 0) + 1;

    return new Chars(counter);
  }

  /**
   * @param {String} text
   * @returns {Chars}
   */
  static frequency(text) {
    let counter = Chars.count(text);

    let total = 0;
    for (let char of counter.chars)
      total += counter.count[char];

    for (let char of counter.chars)
      counter.count[char] /= total;

    return counter;
  }
}

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

  /**
   * @param {String} nativeText
   */
  crack(nativeText) {
    /** @type {(text: String) => Number} */
    const indexOfCoincidence = (text) => {
      let chars = Chars.count(text);

      let n = 0, total = 0;

      for (let char of chars.chars) {
        n += chars.count[char] * (chars.count[char] - 1);
        total += chars.count[char];
      }

      let index = this.alphabet.cardinality * n / (total * (total - 1));

      return index;
    };

    /** @type {(filtredText: String) => String[]} */
    const computeKeyLength = (filtredText) => {
      let found = false;
      let length = 0;
      let slices = [];

      while (!found) {
        ++length;

        slices = [];

        for (let i = 0; i < length; ++i)
          slices.push("");

        for (let i = 0; i < filtredText.length; ++i)
          slices[i % length] += filtredText[i];

        let sum = 0;

        for (let i = 0; i < length; ++i)
          sum += indexOfCoincidence(slices[i]);

        let indexOfCoincidenceVal = sum / length;

        if (indexOfCoincidenceVal > 1.6)
          found = true;
      }

      return slices;
    };

    let filtredText = this.alphabet.filter(this.text);

    let slices = computeKeyLength(filtredText);

    let nativeFiltredText = this.alphabet.filter(nativeText.toLowerCase());

    let key = this.crackKey(slices, nativeFiltredText);

    return key;
  }

  /**
   * @param {String[]} slices
   * @param {String} nativeFiltredText
   * @returns {String}
   */
  crackKey(slices, nativeFiltredText) {
    /** @type {(nativeFrequency: Chars, sliceFrequency: Chars) => String} */
    const crackCaesarsChar = (nativeCharsFreq, sliceFrequency) => {
      let min = +Infinity;
      let minShift = 0;

      for (let i = 0; i < this.alphabet.cardinality; ++i) {
        let k = 0;

        for (let char of nativeCharsFreq.chars) {
          let shifted = this.alphabet.shift(char, i);

          if (nativeCharsFreq.count != undefined && sliceFrequency.count[shifted] != undefined)
            k += (nativeCharsFreq.count[char] - sliceFrequency.count[shifted]) ** 2;
        }

        if (k < min) {
          min = k;
          minShift = i;
        }
      }

      return this.alphabet.char(minShift);
    };

    let nativeCharsFreq = Chars.frequency(nativeFiltredText);

    let key = "";
    for (let slice of slices) {
      let sliceCharFreq = Chars.frequency(slice);
      let crackedChar = crackCaesarsChar(nativeCharsFreq, sliceCharFreq);

      key += crackedChar;
    }

    return key;
  }
}


const { readFileSync, writeFileSync, existsSync } = require("fs");

let mode = process.argv[2];

if (!(mode == 'encode' || mode == 'decode')) {
  console.error('you should specify encode/decode mode!');
  process.exit(-1);
}

let lang = process.argv.at(-1) || 'en';

if (!(lang == 'en' || lang == 'ru')) {
  console.error('we do not support such lang as %s', lang);
  process.exit(-1);
}

let input = process.argv[3];

if (!existsSync(input)) {
  console.error('there is no such file as %s', input);
  process.exit(-1);
}

let output = process.argv[4];

let text = readFileSync(input, 'utf8');

let v = new Vigenere(text, ALPHABETS[lang]);

if (mode == 'encode') {
  let key = process.argv[5];

  let encoded = v.perform(key, 'addChars');

  writeFileSync(output, encoded, 'utf8');
} else {
  let native = process.argv[5];

  if (!existsSync(native)) {
    console.error('there is no such file as %s', native);
    process.exit(-1);
  }

  let nativeText = readFileSync(native, 'utf8');

  let key = v.crack(nativeText);

  console.debug('key is "%s"', key);

  let decoded = v.perform(key, 'subChars');

  writeFileSync(output, decoded, 'utf8');
}
