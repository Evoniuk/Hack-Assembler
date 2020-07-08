import parse from "./src/parser.js";
import handleSymbols from "./src/handleSymbols.js";
import assemble from "./src/assemble.js";

document.getElementById('fileInput').addEventListener('change', function() {
  const file = this.files[0];
  const fileName = file.name.substring(0, file.name.indexOf('.'));

  const reader = new FileReader();
  reader.onload = () => displayCode(reader.result, fileName);
  reader.readAsText(file);
})

document.getElementById('inputCode').addEventListener('click', function() {
  const codeInput = document.getElementById('codeInput').value;
  displayCode(codeInput, 'program');
})

function displayCode (code, fileName) {
  const outputOriginal = document.getElementById('outputOriginal');
  const outputArea = document.getElementById('output');
  outputOriginal.textContent = '';
  outputArea.textContent = '';

  const processedCode = process(code);

  if (processedCode[1].length > 50)
    download(fileName + '.hack', processedCode[1].join('\n'));
  else {
    for (let i = 0; i < processedCode[0].length; i++) {
      outputOriginal.textContent += processedCode[0][i] + '\n';
      outputArea.textContent += processedCode[1][i] + '\n';
    }
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

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
