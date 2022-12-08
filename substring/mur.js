const { Find, NOT_FOUND } = require('./find')

class FindMur extends Find {
  constructor(query) {
    super(query);

    let { alphabet, shifts } = buildBadSymbol(query);

    this.alphabet = alphabet;
    this.badSymbol = shifts;

    this.goodSuffics = buildGoodSuffices(query);

    console.debug(this);
  }

  findNext(buffer) {
    let index = NOT_FOUND;

    // while (buffer.left() > 0 && index == NOT_FOUND) {
    //   for (let )
    // }

    return index;
  }
}

function buildBadSymbol(query) {
  let shifts = {};
  let alphabet = [];

  for (let i = 0; i < query.left(0); ++i) {
    const char = query.getEnd(i);

    if (shifts[char] == undefined) {
      alphabet.push(char);

      if (i != 0) {
        shifts[char] = i;
      }
    }
  }

  return { shifts, alphabet };
}

function buildGoodSuffices(query) {
  let shifts = [];
  let length = query.left(0);

  for (let i = 0; i < length; ++i) {
    for (let j = 0; j < length; ++j) {
      let k = 0;

      while (k < i && (j + k >= length || query.getEnd(j + k) == query.getEnd(k)))
        ++k;

      if ((j + k >= length) || (k == i && query.getEnd(j + k) != query.getEnd(k))) {
        shifts.push(j);
        break;
      }
    }
  }

  return shifts;
}

module.exports = { FindMur };