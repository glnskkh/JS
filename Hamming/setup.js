function checkBinaryInput(content, expectedLenght) {
  if (content.length != expectedLenght)
    return false;

  for (let char of content)
    if (!(char == '0' || char == '1'))
      return false;

  return true;
}

function checkedFound(id) {
  let element = document.getElementById(id);

  if (!element) {
    console.error(`there is no such element with id ${id}`);
    return;
  }

  return element;
}

function validateButton(inputId, buttonId, expectedLenght) {
  let input = checkedFound(inputId);
  let button = checkedFound(buttonId);

  if (!input || !button) {
    console.error("error while validateButton! one of elements wasnt found");
    return;
  }

  input.oninput = _ => {
    button.disabled = !checkBinaryInput(input.value, expectedLenght);
  };
}

function wrapPress(inputId, outputId, buttonId, f, errorId) {
  let input = checkedFound(inputId);
  let button = checkedFound(buttonId);
  let output = checkedFound(outputId);

  let errorElement = checkedFound(errorId);

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

validateButton('coded', 'codedButton', 4);
validateButton('encoded', 'encodedButton', 7);

wrapPress('coded', 'encoded', 'codedButton', hammingEncode, 'errorSpan');
wrapPress('encoded', 'coded', 'encodedButton', hammingDecode, 'errorSpan');
