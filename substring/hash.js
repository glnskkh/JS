const { Find, NOT_FOUND } = require('./find');

class FindHash extends Find {
  constructor(buffer, query, hash) {
    super(buffer, query);
    this.hash = hash;
    this.hashSum = hash.initial(buffer, query.length);

    this.querySum = hash.initial(query, query.length);
  }

  findNext() {
    let index = NOT_FOUND;

    while (this.cursor + this.query.length <= this.buffer.length && index == NOT_FOUND) {
      if (this.hashSum == this.querySum)
        index = this.cursor;

      if (this.cursor + this.query.length < this.buffer.length) {
        let last = this.buffer[this.cursor];
        let next = this.buffer[this.cursor + this.query.length];

        this.hashSum = this.hash.next(this.hashSum, last.charCodeAt(0), next.charCodeAt(0));
      }

      ++this.cursor;
    }

    return index;
  }
}

class RecHash {
  constructor({ initial, next }) {
    this.initialFunc = initial;
    this.nextFunc = next;
  }

  initial() {
    return this.initialFunc.call(this, ...arguments);
  }

  next() {
    return this.nextFunc.call(this, ...arguments);
  }
}


const hashSum = new RecHash({
  initial: (string, len) => {
    let result = 0;

    for (let i = 0; i < len; ++i)
      result = result + string.charCodeAt(i);

    return result;
  },
  next: (prevHash, lastCharCode, nextCharCode) =>
    prevHash - lastCharCode + nextCharCode
});

const hashSqSum = new RecHash({
  initial: (string, len) => {
    let hash = 0;

    for (let i = 0; i < len; ++i)
      hash = hash + Math.pow(string.charCodeAt(i), 2);

    return hash;
  },
  next: (prevHash, lastCharCode, nextCharCode) =>
    prevHash - Math.pow(lastCharCode, 2) + Math.pow(nextCharCode, 2)
});

const hashRK = new RecHash({
  initial: (string, len) => {
    this.x = 2;
    this.pow = 1;
    this.p = 23232331;

    let hash = 0;

    for (let i = 0; i < len; ++i) {
      hash = (hash + this.pow * string.charCodeAt((len - 1) - i)) % this.p;
      this.pow = (this.pow * this.x) % this.p;
    }

    this.pow = this.pow / this.x;

    return hash;
  },
  next: (prevHash, lastCharCode, nextCharCode) =>
    ((prevHash - lastCharCode * this.pow) * this.x + nextCharCode) % this.p

});

module.exports = { FindHash, hashSum, hashSqSum, hashRK };