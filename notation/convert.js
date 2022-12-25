// @ts-check

function checkedRead(path, encoding) {
  const fs = require('fs');

  if (!fs.existsSync(path)) {
    console.error(`file ${path} is not avaliable`);
    process.exit(-1);
  }

  let rawText = fs.readFileSync(path, encoding || 'utf8');

  return rawText;
}

function removeSpaces(string) {
  let withoutSpaces = '';

  for (let char of string)
    if (!(char == ' ' || char == '\n' || char == '\t'))
      withoutSpaces = withoutSpaces.concat(char);

  return withoutSpaces;
}

function numberEnd(expression, start) {
  while (start < expression.length && priority(expression[start]) == priority('1'))
    ++start;

  return start;
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


function buildPolish(expression) {
  let polish = [];
  let operations = [];

  let cursor = 0;

  while (cursor < expression.length) {
    // Number processing
    let numEnd = numberEnd(expression, cursor);

    if (numEnd != cursor) {
      let numberString = expression.slice(cursor, numEnd);

      let number = parseFloat(numberString);
      polish.push(number);

      cursor = numEnd;
      continue;
    }

    // Operation processing
    let operation = expression[cursor];
    let operationP = priority(operation);

    ++cursor;

    if (operation == '(') {
      operations.push('(');
      continue;
    }

    let topOperation = operations.pop();
    let topOperationPriority = priority(topOperation);

    if (operationP >= topOperationPriority) {
      if (topOperation != undefined)
        operations.push(topOperation);

      operations.push(operation);
      continue;
    }

    while (operationP < topOperationPriority) {
      polish.push(topOperation);

      topOperation = operations.pop();
      topOperationPriority = priority(topOperation);
    }

    if (operation != ')')
      operations.push(operation);
  }

  while (operations.length > 0) {
    let operation = operations.pop();

    polish.push(operation);
  }

  return polish;
}

function compute(polish) {
  let numbers = [];

  for (let operand of polish) {
    if (priority(operand) == priority('1')) {
      numbers.push(operand);
    } else {
      let b = numbers.pop();
      let a = numbers.pop();

      numbers.push(perform(operand, a, b));
    }
  }

  return numbers.pop();
}


let inputFile = process.argv[2];

let expression = removeSpaces(checkedRead(inputFile));

let polish = buildPolish(expression);

console.log(polish.join(' '));
console.log(compute(polish));
