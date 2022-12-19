// @ts-check

class Cell {
  /**
   * @param {number} [x]
   * @param {number} [y]
   * @param {boolean} isAlive
   */
  constructor(x, y, isAlive = false) {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive;
  }

  birth() {
    this.isAlive = true;
  }

  death() {
    this.isAlive = false;
  }
}

class World {
  /**
   * @param {number} height
   * @param {number} width
   */
  constructor(height, width) {
    this.height = height;
    this.width = width;

    /** @type {Cell[][]} */
    this.cells = [];

    this.cells = [];

    for (let i = 0; i < this.width; ++i) {
      this.cells.push([]);

      for (let j = 0; j < this.height; ++j)
        this.cells[i].push(new Cell(i, j));
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  countAliveNeighbours(x, y) {
    let count = 0;

    for (let i = 0; i <= 2; ++i) {
      for (let j = 0; j <= 2; ++j) {
        if (i == 1 && j == 1)
          continue;

        const relX = (this.width + x + i - 1) % this.width;
        const relY = (this.height + y + j - 1) % this.height;

        if (this.cells[relX][relY].isAlive)
          ++count;
      }
    }

    return count;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  changeCell(x, y) {
    this.cells[x][y].isAlive = !this.cells[x][y].isAlive;
  }

  /** @returns {World} */
  regenerate() {
    let newWorld = new World(this.height, this.width);

    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        const count = this.countAliveNeighbours(x, y);

        if (count == 3)
          newWorld.cells[x][y].birth();
        else if (count == 2)
          newWorld.cells[x][y].isAlive = this.cells[x][y].isAlive;
        else
          newWorld.cells[x][y].death();
      }
    }

    return newWorld;
  }
}

/** @type {World} */
let world;

/**
 * @param {number} height
 * @param {number} width
 */
function initGeneration(height, width) {
  world = new World(height, width);
}

/**
 * @param {number} x
 * @param {number} y
 */
function changeGeneration(x, y) {
  world.changeCell(x, y);
}

function getGeneration() {
  return world.cells;
}

function newGeneration() {
  world = world.regenerate();
}

function initRandom() {
  const CHANCE = 0.25;

  world = new World(world.height, world.width);

  for (let i = 0; i < world.width; ++i)
    for (let j = 0; j < world.height; ++j)
      if (Math.random() < CHANCE)
        world.cells[i][j].birth();
}
