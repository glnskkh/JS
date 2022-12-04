// @ts-check

let expressionPath = process.argv[2];

let expressionRaw = checkedRead(expressionPath);
let expression = removeSpaces(expressionRaw);

let polish = buildPolish(expression);

console.log(polish.join(' '));
console.log(compute(polish));


function buildPolish(expression) {
  let polish = [];
  let operations = [];

  let cursor = 0;

  while (cursor < expression.length) {
    let numEnd = numberEnd(expression, cursor);

    if (numEnd != cursor) {
      let numberString = expression.slice(cursor, numEnd);

      let number = parseFloat(numberString);
      polish.push(number);

      cursor = numEnd;
      continue;
    }

    let operation = expression[cursor];
    let p = priority(operation);

    cursor += 1;

    if (operation == '(') {
      operations.push('(');
      continue;
    }

    let P = priority(operations[operations.length - 1]);

    if (!(p < P)) {
      operations.push(operation);
      continue;
    }

    while (p < P) {
      if (operation != ')')
        polish.push(operation);

      operation = operations.pop();
      p = priority(operation);
    }
  }

  while (operations.length > 0)
    polish.push(operations.pop());

  return polish;
}

function compute(polish) {
  let numbers = [];

  for (let operand of polish) {
    if (typeof operand == 'number') {
      numbers.push(operand);
    } else {
      let b = numbers.pop();
      let a = numbers.pop();

      numbers.push(perform(operand, a, b));
    }
  }

  return numbers.pop();
}

function priority(operation) {
  switch (operation) {
    case '(': case ')': return 0;
    case '+': case '-': return 1;
    case '*': case '/': return 2;
    case '^': return 3;
  }

  return -1;
}

function perform(operation, a, b) {
  switch (operation) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b == 0) {
        console.error(`cannot divide ${a} by zero`);
        process.exit(-1);
      }
      return a / b;
    case '^': return Math.pow(a, b);
    default:
      console.error(`unsupported operation ${operation}`);
      process.exit(-1);
  }
}

function numberEnd(expression, start) {
  while (start < expression.length && priority(expression[start]) == priority(''))
    ++start;

  return start;
}

function removeSpaces(string) {
  let withoutSpaces = '';

  for (let char of string)
    if (!(char == ' ' || char == '\n' || char == '\t'))
      withoutSpaces = withoutSpaces.concat(char);

  return withoutSpaces;
}

function checkedRead(path, encoding) {
  const fs = require('fs');

  if (!fs.existsSync(path)) {
    console.error(`file ${path} is not avaliable`);
    process.exit(-1);
  }

  let rawText = fs.readFileSync(path, encoding || 'utf8');

  return rawText;
}