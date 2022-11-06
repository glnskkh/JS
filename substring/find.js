const NOT_FOUND = -1;

class Find {
  constructor(query) {
    this.query = query;
    this.queryLen = query.left();
  }

  findNext(buffer) {
    return NOT_FOUND;
  }
}

class Finder {
  static getIndecies(buffer, finder, n = -1) {
    let indecies = [];

    let index;
    while (
      (index = finder.findNext(buffer)) != NOT_FOUND &&
      (n--) != 0
    )
      indecies.push(index);

    return indecies;
  }
}

class Buffer {
  constructor(iterable) {
    this.iterable = iterable;
    this.cursor = 0;
  }

  getRelative(index = 0, offset = this.cursor) {
    return this.iterable[offset + index];
  }

  get(index = this.cursor) {
    return this.getRelative(0, index);
  }

  getNext() {
    return this.iterable[this.cursor++];
  }

  moveCursor(shift, offset = this.cursor) {
    this.cursor = shift + offset;
  }

  left(index = this.cursor) {
    return this.iterable.length - index;
  }

  flush() {
    this.cursor = 0;
  }
}

module.exports = { NOT_FOUND, Find, Finder, Buffer };