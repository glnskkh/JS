let { Find, NOT_FOUND } = require('./find');

class FindBrute extends Find {
  constructor(query) {
    super(query);
  }

  findNext(buffer) {
    let index = NOT_FOUND;

    while (this.queryLen <= buffer.left() && index == NOT_FOUND) {
      let valid = true;

      for (let i = 0; i < this.queryLen; ++i)
        if (this.query.get(i) != buffer.getRelative(i)) {
          valid = false;
          break;
        }

      if (valid)
        index = buffer.cursor;

      buffer.moveCursor(1);
    }

    return index;
  }
}

module.exports = { FindBrute };