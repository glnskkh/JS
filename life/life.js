// @ts-check

class Cell {
  constructor(isAlive = false) {
    this.isAlive = isAlive;
  }

  birth() {
    this.isAlive = true;
  }

  death() {
    this.isAlive = false;
  }
}

/** @type {Cell[][]} */
let arr;

/**
 * @param {number} height
 * @param {number} width
 */
function initGeneration(height, width) {
  arr = [];

  for (let i = 0; i < width; ++i) {
    arr.push([]);

    for (let j = 0; j < height; ++j)
      arr[i].push(new Cell());
  }
}

/**
 * @param {number} x
 * @param {number} y
 */
function changeGeneration(x, y) {
  console.debug(x, y);

  arr[y][x].isAlive = !arr[y][x].isAlive;
}

function getGeneration() {
  return arr;
}

function newGeneration() {

}


function refreshWorld() { }

function stop() { }
