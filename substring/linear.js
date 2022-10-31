let { Find } = require('./find');

class FindLinear extends Find {
  constructor(buffer, query) {
    super(buffer, query);
  }

  findNext() {
    while (this.cursor + this.query.length <= this.buffer.length) {
      let i = 0;
      while (i < this.query.length &&
        this.query[i] == this.buffer[this.cursor + i])
        ++i;

      if (i == this.query.length) {
        let index = this.cursor;

        this.cursor += i;
        return index;
      }

      ++this.cursor;
    }

    return -1;
  }
}

module.exports = { FindLinear };