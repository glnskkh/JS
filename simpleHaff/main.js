function swap(array, i, j) {
  let t = array[i];
  array[i] = array[j];
  array[j] = t;
}

function binary(number) {
  if (number == 0)
    return "0"

  let digits = [];

  while (number > 0) {
    digits.push((number % 2).toString());

    number = Math.floor(number / 2);
  }

  for (let i = 0; i < digits.length / 2; i++)
    swap(digits, i, (digits.length - 1) - i);

  let result = digits.join("");

  return result;
}

class PriorityQueue {
  constructor() {
    this.array = [];
  }

  isEmpty() { return this.array.length == 0; }

  /**
   * @param {number} i
   */
  parent(i) {
    let parentIndex = Math.floor((i + 1) / 2) - 1;

    return parentIndex;
  }

  /**
   * @param {number} i
   */
  children(i) {
    let child1 = 2 * i + 1;
    let child2 = 2 * i + 2;

    return [child1, child2];
  }

  /**
   * @param {{getWeight: () => number}} value
   */
  push(value) {
    this.array.push(value);

    let valueIndex = this.array.length - 1;

    while (true) {
      let parentIndex = this.parent(valueIndex);

      if (0 > parentIndex) break;

      let parent = this.array[parentIndex];

      if (parent.getWeight() <= value.getWeight())
        break;

      swap(this.array, parentIndex, valueIndex);
      valueIndex = parentIndex;
    }
  }

  pop() {
    if (this.array.length == 0)
      return null;

    swap(this.array, 0, this.array.length - 1);

    let head = this.array.pop();

    let tail = this.array[0];
    let tailIndex = 0;

    while (true) {
      let [child1, child2] =
        this.children(tailIndex);

      let left = this.array[child1];
      let right = this.array[child2];

      if (left == undefined) break;

      let min = left, minIndex = child1;

      if (right != undefined) {
        if (right.getWeight() < left.getWeight())
          min = right, minIndex = child2;
      }

      if (tail.getWeight() <= min.getWeight()) break;

      swap(this.array, tailIndex, minIndex);
      tailIndex = minIndex;
    }

    return head;
  }
}

class BinTree {
  constructor(left = null, right = null) {
    this.left = left;
    this.right = right;
  }
}

class HaffNode {
  constructor(count, char) {
    this.count = count;
    this.char = char;
  }
}

class HaffTree extends BinTree {
  /**
   * @param {HaffNode} value
   */
  constructor(value, left = null, right = null) {
    super(left, right);
    this.value = value;
  }

  getWeight() {
    return this.value.count;
  }
}

const fs = require('fs');

let type = process.argv[2];

let isEncode = type.startsWith('en');
let isDecode = type.startsWith('de');

if (!(isEncode || isDecode)) {
  console.log('specify mode (encode | decode)');
  process.exit(1);
}

let inputFile = process.argv[3];

if (!fs.existsSync(inputFile)) {
  console.error("please specify existing file");
  process.exit(1);
}

let tableFile = process.argv[4];
let outputFile = process.argv[5];

let content = fs.readFileSync(inputFile, 'utf8');

function haffmanEncode(content) {
  let chars = {};
  for (let char of content) {
    chars[char] = chars[char] == undefined ? 0 : chars[char];

    chars[char]++;
  }

  let pq = new PriorityQueue();

  for (let char of Object.keys(chars)) {
    let tree = new HaffTree(
      new HaffNode(chars[char], char)
    );

    pq.push(tree);
  }

  while (!(pq.array.length <= 1)) {
    let least1 = pq.pop();
    let least2 = pq.pop();

    let tree = new HaffTree(
      new HaffNode(least1.value.count + least2.value.count),
      least1,
      least2
    );

    pq.push(tree);
  }

  let haffTree = pq.pop();

  let charToCode = {};
  let next = [[haffTree.left, "0"], [haffTree.right, "1"]];
  while (next.length > 0) {
    let [tree, code] = next.pop();

    if (tree.value.char == undefined) {
      next.push([tree.left, code.concat("0")]);
      next.push([tree.right, code.concat("1")]);
    } else {
      charToCode[tree.value.char] = binary(code);
    }
  }

  let codeToChar = {};
  for (let key of Object.keys(charToCode)) {
    if (!codeToChar[charToCode[key]])
      codeToChar[charToCode[key]] = key;
    else
      console.log(codeToChar[charToCode[key]], key);
  }

  let output = "";
  for (let char of content) {
    output = output.concat(charToCode[char]);
  }

  return { output, table: codeToChar };
}

function haffmanDecode(content, table) {
  let buffer = "";
  let output = "";

  for (let sym of content) {
    buffer = buffer.concat(sym);

    if (table[buffer]) {
      output = output.concat(table[buffer]);

      buffer = "";
    }
  }

  if (buffer.length != 0)
    console.error("there were some errors during decode");

  return output;
}

if (isDecode) {
  if (!fs.existsSync(tableFile)) {
    console.error("there is no such table file, please specify another");
    process.exit(1);
  }

  let tableContent = fs.readFileSync(tableFile, 'utf8');

  let table = JSON.parse(tableContent);

  let output = haffmanDecode(content, table);

  fs.writeFileSync(outputFile, output, 'utf8');
}

if (isEncode) {
  let { output, table } = haffmanEncode(content);

  fs.writeFileSync(outputFile, output, 'utf8');
  fs.writeFileSync(tableFile, JSON.stringify(table), 'utf8');
}