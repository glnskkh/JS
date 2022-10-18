function Tree(left, right, count, char) {
  this.left = left;
  this.right = right;
  this.count = count;
}

let t1 = new Tree(null, null, 12);
let t2 = new Tree(null, null, 21);

let T = new Tree(t1, t2, t1.count + t2.count);


let charToCode = {};
let arr = [[T.left, "0"], [T.right, "1"]];
while (arr.length > 0) {
  let [tree, code] = arr.pop();

  if (tree.char == undefined) {
    arr.push([tree.left, code + "0"]);
    arr.push([tree.right, code + "1"]);
  } else {
    charToCode[tree.char] = code;
  }
}
