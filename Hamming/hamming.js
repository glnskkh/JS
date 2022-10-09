function hammingEncode(content) {
  let number = parseInt(content, 2);

  return { result: number }
}

function hammingDecode(content) {
  let number = parseInt(content, 2);

  return { error: "aaa" }
}
