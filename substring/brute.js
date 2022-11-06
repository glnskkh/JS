let { Find, NOT_FOUND } = require('./find');

class FindBrute extends Find {
  constructor(query) {
    super(query);
  }

  findNext(buffer) {
    let index = NOT_FOUND;

    while (buffer.left() >= this.query.left()) {
      let valid = true;

      for (let i = 0; i < this.query.left(); ++i)
        if (this.query.get(i) != buffer.getRelative(i)) {
          valid = false;
          break;
        }

      if (valid) {
        index = buffer.cursor;
        break;
      }

      buffer.moveCursor(1);
    }

    return index;
  }
}

module.exports = { FindBrute };