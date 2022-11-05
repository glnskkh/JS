const NOT_FOUND = -1;

class Find {
  constructor(query) {
    this.buffer = [];
    this.query = query;

    this.cursor = 0;
  }

  setBuffer(buffer) {
    this.buffer = buffer;
    this.cursor = 0;
  }

  findNext() {
    return NOT_FOUND;
  }
}

class Finder {
  static getIndecies(buffer, finder, n = -1) {
    finder.setBuffer(buffer);

    let indecies = [];

    let index;
    while ((index = finder.findNext()) != NOT_FOUND) {
      if (n == 0)
        break;
      if (n > 0)
        --n;

      indecies.push(index);
    }

    return indecies;
  }
}

module.exports = { NOT_FOUND, Find, Finder };