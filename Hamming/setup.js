const CODE_LEN = 4;
const ENCODED_LEN = 7;

let code = {
  input: checkedGet('.code input'),
  button: checkedGet('.code button')
};

let encode = {
  input: checkedGet('.encode input'),
  button: checkedGet('.encode button')
};

let errorSpan = checkedGet('#errorSpan');

validateInput(code.input, code.button, CODE_LEN);
validateInput(encode.input, encode.button, ENCODED_LEN);

wrapPress(code.button, hammingEncode, code.input, encode.input, errorSpan);
wrapPress(encode.button, hammingDecode, encode.input, code.input, errorSpan);

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

function removeLastChar(inputElement) {
  inputElement.value = inputElement.value.slice(0, inputElement.value.length - 1);
}

function validateInput(input, button, expectedLength) {
  input.oninput = _ => {
    let isBinary = checkBinary(input.value);
    let lengthOverflow = checkLength(input.value, expectedLength);

    if (lengthOverflow > 0) {
      removeLastChar(input);
      lengthOverflow = checkLength(input.value, expectedLength);
    }

    if (!isBinary) {
      removeLastChar(input);
      isBinary = checkBinary(input.value);
    }

    button.disabled = !(isBinary && lengthOverflow == 0);
  };
}

function wrapPress(button, f, input, output, errorSpan) {
  button.onclick = _ => {
    let { result, error } = f(input.value);

    if (result == undefined) {
      output.value = "";
      errorSpan.innerText = error;
      button.disabled = true;
    } else {
      output.value = result;
      errorSpan.innerText = "";
      button.disabled = false;
    }
  };
}
