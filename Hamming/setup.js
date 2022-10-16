const CODE_LEN = 4;
const ENCODED_LEN = 7;

validateInput('.code input', `.code button`, CODE_LEN);
validateInput('.encode input', '.encode button', ENCODED_LEN);

wrapPress('.code input', '.encode input', '.code button', hammingEncode, '#errorSpan');
wrapPress('.encode input', '.code input', '.encode button', hammingDecode, '#errorSpan');

function checkBinary(content, expectedLenght) {
  if (content.length != expectedLenght)
    return false;

  for (let char of content)
    if (!(char == '0' || char == '1'))
      return false;

  return true;
}

function checkedGet(id) {
  let element = document.querySelector(id);

  if (!element) {
    console.error(`there is no such element with id ${id}`);
    return;
  }

  return element;
}

function validateInput(inputId, buttonId, expectedLenght) {
  let input = checkedGet(inputId);
  let button = checkedGet(buttonId);

  if (!input || !button) {
    console.error("error while validateButton! one of elements wasnt found");
    return;
  }

  input.oninput = _ => {
    button.disabled = !checkBinary(input.value, expectedLenght);
  };
}

function wrapPress(inputId, outputId, buttonId, f, errorId) {
  let input = checkedGet(inputId);
  let button = checkedGet(buttonId);
  let output = checkedGet(outputId);

  let errorElement = checkedGet(errorId);

  if (!input || !button || !output || !errorElement) {
    console.error("error while wrapPress! one of elements wasnt found")
    return;
  }

  button.onclick = _ => {
    let { result, error } = f(input.value);

    if (result == undefined) {
      errorElement.innerText = error;
      output.value = "";
      return;
    }

    errorElement.innerText = "";
    output.value = result;
  };
}
