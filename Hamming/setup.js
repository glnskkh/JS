const PARITY_BITS = 3;

const ENCODED_LEN = Math.pow(2, PARITY_BITS) - 1;
const CODE_LEN = ENCODED_LEN - PARITY_BITS;

let code = {
  input: checkedGet('.code input'),
  button: checkedGet('.code button')
};

let encode = {
  input: checkedGet('.encode input'),
  button: checkedGet('.encode button')
};

let decode = {
  input: checkedGet('.decode input')
};

let errorSpan = checkedGet('#errorSpan');

validateInput(code.input, CODE_LEN, code.button);
validateInput(encode.input, ENCODED_LEN, encode.button);

wrapPress(code.button, hammingEncode, code.input, encode.input, errorSpan);
wrapPress(encode.button, hammingDecode, encode.input, decode.input, errorSpan);


function checkBinary(content) {
  for (let char of content)
    if (!(char == '0' || char == '1'))
      return false;

  return true;
}

function checkLength(content, expectedLength) {
  return content.length - expectedLength;
}

function checkedGet(selector) {
  let element = document.querySelector(selector);

  if (!element) {
    console.error(`there is no such element with id ${selector}`);
    return;
  }

  return element;
}

function removeLastChars(inputElement, length) {
  inputElement.value =
    inputElement.value.slice(0, inputElement.value.length - length);
}

function replaceNonBinary(inputElement) {
  let value = '';

  for (let char of inputElement.value)
    if (char == '0' || char == '1')
      value = value.concat(char);

  inputElement.value = value;
}

function validateInput(input, expectedLength, button) {
  input.oninput = input.onpaste = input.onchange = input.onfocus = _ => {
    let isBinary = checkBinary(input.value);

    if (!isBinary) {
      replaceNonBinary(input);
      isBinary = checkBinary(input.value);
    }

    let lengthOverflow = checkLength(input.value, expectedLength);

    if (lengthOverflow > 0) {
      removeLastChars(input, lengthOverflow);
      lengthOverflow = checkLength(input.value, expectedLength);
    }

    button.disabled = !(isBinary && lengthOverflow == 0);
  };
}

function wrapPress(button, f, input, output, errorSpan) {
  button.onclick = _ => {
    let { result, error } = f(input.value);

    errorSpan.innerText = error ?? '';
    output.value = result;

    output.focus();
  };
}
