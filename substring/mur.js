const { Find, NOT_FOUND } = require('./find')

class FindMur extends Find {
  constructor(query) {
    super(query);

    let { alphabet, shifts } = buildBadSymbol(query);

    this.alphabet = alphabet;
    this.shifts = shifts;


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
      shifts[char] = i;
      alphabet.push(char);
    }
  }

  return { shifts, alphabet };
}

function buildGoodSuffics(query) {

}

module.exports = { FindMur };