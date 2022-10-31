let { Find } = require('./find');

class FindBrute extends Find {
  constructor(buffer, query) {
    super(buffer, query);
  }

  findNext() {
    while (this.cursor + this.query.length <= this.buffer.length) {
      let valid = true;

      for (let i = 0; i < this.query.length; ++i)
        if (this.query[i] != this.buffer[this.cursor + i])
          valid = false;

      this.cursor++;

      if (valid)
        return this.cursor - 1;
    }

    return -1;
  }
}

module.exports = { FindBrute };