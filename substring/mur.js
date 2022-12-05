const { Find, NOT_FOUND } = require('./find')

class FindMur extends Find {
  constructor(query) {
    super(query);


  }

  findNext(buffer) {
    return NOT_FOUND;
  }
}

module.exports = { FindMur };