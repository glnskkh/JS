const NOT_FOUND = -1;

class Find {
  constructor(query) {
    this.query = query;
  }

  findNext(buffer) {
    return NOT_FOUND;
  }
}

class Finder {
  static getIndecies(buffer, finder, n = -1) {
    let indecies = [];

    let index;
    while ((index = finder.findNext(buffer)) != NOT_FOUND && (n--) != 0) {
      indecies.push(index);
      buffer.moveCursor(1);
    }

    return indecies;
  }
}

class Buffer {
  constructor(iterable) {
    this.iterable = iterable;
    this.cursor = 0;
  }

  getShifted(index = 0, shift = this.cursor) {
    return this.iterable[index + shift];
  }

  get(index = this.cursor) {
    return this.getShifted(0, index);
  }

  getNext() {
    return this.iterable[this.cursor++];
  }

  getRelative(offset = 0) {
    return this.get(this.cursor + offset);
  }

  moveCursor(shift, offset = this.cursor) {
    this.cursor = shift + offset;
  }

  left(index = this.cursor) {
    return this.iterable.length - index;
  }
}

module.exports = { NOT_FOUND, Find, Finder, Buffer };