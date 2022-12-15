const fs = require('fs');

const mode = process.argv[2];

const text = getFileText(3).toLowerCase();

if (mode.startsWith('en')) {
  const key = getFileText(4);
  const alpha = JSON.parse(getFileText(5));

  fs.writeFileSync(
    process.argv[6],
    vigenerePerform(text, key, alpha, sumChars),
    'utf8'
  );
} else if (mode.startsWith('de')) {
  const alpha = JSON.parse(getFileText(4));

  const nativeText = filterText(getFileText(6).toLowerCase(), alpha);

  const dict = getFileText(7, alpha).toLowerCase();

  const key = vigenereCrack(text, alpha, nativeText, dict);

  console.log(key);

  fs.writeFileSync(
    process.argv[5],
    vigenerePerform(text, key, alpha, subChars),
    'utf8'
  );
} else {
  console.error('you should specify mode (encode|decode)');
  process.exit(-1);
}


function vigenerePerform(text, key, alpha, func) {
  let textCursor = 0;
  let keyCursor = 0;

  let output = "";

  while (textCursor < text.length) {
    let char = text[textCursor];

    if (isAlpha(char, alpha))
      char = charInAlpha(func(char, key[(keyCursor++) % key.length], alpha), alpha);

    output += char;
    ++textCursor;
  }

  return output;
}

function vigenereCrack(text, alpha, nativeText, dict) {
  let filtred = filterText(text, alpha);

  let keyLength = computeKeyLength(filtred, alpha);

  let key = bruteKey(filtred, alpha, keyLength, nativeText, dict);

  return key;
}

function bruteKey(filteredText, alpha, keyLength, nativeText, dict) {
  let tetraFrequencies = calculateTetra(nativeText, alpha);

  let words = dict
    .split('\n')
    .map(x => filterText(x.toLowerCase(), alpha))
    .filter(x => x.length == keyLength);

  const SAMPLE_SIZE = 300;

  for (let word of words) {
    let text = vigenerePerform(filteredText.slice(0, SAMPLE_SIZE), word, alpha, subChars);

    if (word == 'привет') {
      console.log(fitness(text, tetraFrequencies, alpha));
    }

    if (fitness(text, tetraFrequencies, alpha) > -10)
      return word;
  }

  function fitness(filteredText, tetraFrequencies, alpha) {
    let res = 0;

    const SAMPLE_SIZE = Math.min(filteredText.length, 300);

    for (let i = 0; i < SAMPLE_SIZE - 3; ++i) {
      let k = convert(
        alpha.card,
        positionInAlpha(filteredText[i], alpha),
        positionInAlpha(filteredText[i + 1], alpha),
        positionInAlpha(filteredText[i + 2], alpha),
        positionInAlpha(filteredText[i + 3], alpha),
      );

      let freq = tetraFrequencies[k];

      if (freq == undefined)
        res += -15;
      else
        res += Math.log(freq);
    }

    res /= SAMPLE_SIZE - 3;

    return res;
  }

  function calculateTetra(nativeText, alpha) {
    let freq = {};

    const SAMPLE_SIZE = Math.min(nativeText.length, 1000);

    for (let i = 0; i < SAMPLE_SIZE - 3; ++i) {
      let k = convert(
        alpha.card,
        positionInAlpha(nativeText[i], alpha),
        positionInAlpha(nativeText[i + 1], alpha),
        positionInAlpha(nativeText[i + 2], alpha),
        positionInAlpha(nativeText[i + 3], alpha),
      );

      freq[k] = (freq[k] || 0) + 1;
    }

    for (let i in freq)
      freq[i] /= SAMPLE_SIZE - 3;

    return freq;
  }
}

function convert(card) {
  let res = 0;

  for (let i = 1; i < arguments.length; ++i)
    res = res * card + arguments[i];

  return res;
}

function computeKeyLength(filteredText, alpha) {
  let found = false;
  let period = 0;

  const SAMPLE_SIZE = Math.min(filteredText.length, 200);

  while (!found) {
    ++period;

    let slices = [];

    for (let i = 0; i < SAMPLE_SIZE; ++i)
      slices.push("");

    for (let i = 0; i < SAMPLE_SIZE; ++i)
      slices[i % period] += filteredText[i];

    let sum = 0;

    for (let i = 0; i < period; ++i)
      sum += indexOfCoincidence(slices[i], alpha);

    let indexOfCoincidenceVal = sum / period;

    if (indexOfCoincidenceVal > 1.6)
      found = true;
  }

  return period;

  function indexOfCoincidence(text, alpha) {
    let count = countChars(text);

    let n = 0;
    let total = 0;

    for (let char of Object.keys(count)) {
      n += count[char] * (count[char] - 1);
      total += count[char];
    }

    let index = alpha.card * n / (total * (total - 1));

    return index;
  }
}

function filterText(text, alpha) {
  let output = '';

  for (const char of text)
    if (isAlpha(char, alpha))
      output += char;

  return output;
}

function countChars(text) {
  let count = {};

  for (const char of text)
    count[char] = (count[char] || 0) + 1;

  return count;
}

function isAlpha(char, alpha) {
  let codeBase = alpha.base.charCodeAt(0);
  let codeChar = char.charCodeAt(0);
  let codeEnd = alpha.end.charCodeAt(0);

  return codeBase <= codeChar && codeChar <= codeEnd;
}

function positionInAlpha(char, alpha) {
  let dif = char.charCodeAt(0) - alpha.base.charCodeAt(0);

  if (0 > dif || dif >= alpha.card) {
    console.error(`there is no ${char} in alpha`);
    process.exit(-1);
  }

  return dif;
}

function charInAlpha(position, alpha) {
  if (0 > position || position >= alpha.card) {
    console.error(`there is too few chars to fit ${position} in alpha`);
    process.exit(-1);
  }

  let code = position + alpha.base.charCodeAt(0);
  let char = String.fromCharCode(code);

  return char;
}

function sumChars(char1, char2, alpha) {
  let code1 = positionInAlpha(char1, alpha);
  let code2 = positionInAlpha(char2, alpha);

  let sum = (code1 + code2) % alpha.card;

  return sum;
}

function subChars(char1, char2, alpha) {
  let code1 = positionInAlpha(char1, alpha);
  let code2 = positionInAlpha(char2, alpha);

  let sub = (alpha.card + code1 - code2) % alpha.card;

  return sub;
}

function getFileText(argument) {
  const path = process.argv[argument];

  if (!fs.existsSync(path)) {
    console.error(`the file ${path} does not exists!`);
    process.exit(-1);
  }

  const text = fs.readFileSync(path, 'utf8');

  return text;
}