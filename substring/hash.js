const { Find, NOT_FOUND } = require('./find');

class FindHash extends Find {
  constructor(query, hashFunc) {
    super(query);

    this.hashFunc = hashFunc;
    this.querySum = this.hashFunc.initial(query, this.queryLen);
  }

  findNext(buffer) {
    if (buffer.cursor == 0)
      this.hashSum = this.hashFunc.initial(buffer, this.queryLen);

    let index = NOT_FOUND;

    while (this.queryLen <= buffer.left() && index == NOT_FOUND) {
      if (this.hashSum == this.querySum)
        index = buffer.cursor;

      if (this.queryLen < buffer.left()) {
        let last = buffer.get();
        let next = buffer.getRelative(this.queryLen);

        this.hashSum = this.hashFunc.next(this.hashSum, last, next);
      }

      buffer.moveCursor(1);
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
  initial: (buffer, len) => {
    let result = 0;

    for (let i = 0; i < len; ++i)
      result += buffer.getRelative(i);

    return result;
  },
  next: (prevHash, last, next) =>
    prevHash - last + next
});

const hashSqSum = new RecHash({
  initial: (buffer, len) => {
    let hash = 0;

    for (let i = 0; i < len; ++i)
      hash += Math.pow(buffer.getRelative(i), 2);

    return hash;
  },
  next: (prevHash, last, next) =>
    prevHash - Math.pow(last, 2) + Math.pow(next, 2)
});

const hashRK = new RecHash({
  initial: (buffer, len) => {
    this.x = 2;
    this.pow = 1;
    this.p = 23232331;

    let hash = 0;

    for (let i = 0; i < len; ++i) {
      hash = (hash + this.pow * buffer.getRelative(-i, len - 1)) % this.p;
      this.pow = (this.pow * this.x) % this.p;
    }

    this.pow /= this.x;

    return hash;
  },
  next: (prevHash, last, next) =>
    ((prevHash - last * this.pow) * this.x + next) % this.p
});

module.exports = { FindHash, hashSum, hashSqSum, hashRK };