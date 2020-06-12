document.getElementById('fileInput').addEventListener('change', function() {
  const reader = new FileReader();
  reader.onload = () => displayCode(reader.result);
  reader.readAsText(this.files[0]);
})

document.getElementById('inputCode').addEventListener('click', function() {
  const codeInput = document.getElementById('codeInput').value;
  displayCode(codeInput);
})

function displayCode (code) {
  const outputOriginal = document.getElementById('outputOriginal');
  outputOriginal.textContent = '';

  const outputArea = document.getElementById('output');
  outputArea.textContent = '';

  const processedCode = process(code);
  for (let i = 0; i < processedCode[0].length; i++) {
    outputOriginal.textContent += processedCode[0][i] + '\n';
    outputArea.textContent += processedCode[1][i] + '\n';
  }

  if (outputArea.textContent !== '') {
    outputOriginal.textContent += '\n';
    outputArea.textContent += '\n';
  }
}

function process(code) {
  code = parse(code);
  code = handleSymbols(code);
  originalCode = code.map(line => line);
  return [originalCode, assemble(code)];
}
