function parse(code) {
  code = code.split(/\r?\n/); // splits each line
  return code.map(stripWhitespace).filter(line => line !== '');
}

function stripWhitespace(line) {
  if (line[0] === '/') return ''; // remove line comments
  line = line.replace(/\s/g,'');  // remove spaces

  // remove inline comments
  let result = '';
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '/') break;
    result += line[i];
  }

  return result;
}
