const { Find, NOT_FOUND } = require('./find')

class FindMur extends Find {
  constructor(query) {
    super(query);

    let { alphabet, shifts } = buildBadSymbol(query);

    this.alphabet = alphabet;
    this.badSymbol = shifts;

    this.goodSuffics = buildGoodSuffices(query);
  }

  findNext(buffer) {
    let index = NOT_FOUND;

    while (buffer.left() >= this.queryLen && index == NOT_FOUND) {
      let i = 0;

      while (i < this.queryLen && buffer.getRelative(this.queryLen - 1 - i) == this.query.getEnd(i))
        ++i;

      let shift = Math.max(
        this.badSymbol[this.query.getEnd(i + 1)] ?? 0,
        this.goodSuffics[i] ?? 0,
        1
      );

      if (i == this.queryLen)
        index = buffer.cursor;

      buffer.cursor += shift;
    }

    return index;
  }
}

function buildBadSymbol(query) {
  let shifts = {};
  let alphabet = [];

  for (let i = 0; i < query.left(0); ++i) {
    const char = query.getEnd(i);

    if (shifts[char] == undefined) {
      if (!alphabet.includes(char))
        alphabet.push(char);

      if (i != 0) {
        shifts[char] = i;
      }
    }
  }

  // Если у нас для последнего символа не будет более ранних входжений - сдвигаем на всю длину строки
  shifts[query.getEnd(0)] ||= query.left(0);

  return { shifts, alphabet };
}

function buildGoodSuffices(query) {
  let shifts = [1]; // Для нуля совпавших символоп пусть будет сдвиг 1
  let length = query.left(0);

  for (let i = 1; i < length; ++i) {
    for (let j = 1; j < length; ++j) {
      let k = 0;

      while (k < i && j + k < length && query.getEnd(j + k) == query.getEnd(k))
        ++k;

      if (j + k == length || k == i) {
        shifts.push(j);
        break;
      }
    }
  }

  return shifts;
}

module.exports = { FindMur };