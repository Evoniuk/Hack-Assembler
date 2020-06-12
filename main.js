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
  const outputArea = document.getElementById('output');
  outputOriginal.textContent = '';
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
  const parsedCode = parse(code);
  const unSymbolized = handleSymbols(parsedCode);
  return [unSymbolized, assemble(unSymbolized)];
}
