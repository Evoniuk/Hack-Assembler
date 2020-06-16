function parse(code) {
  return code
    .split(/\r?\n/)
    .map(stripWhitespace)
    .filter(line => line !== '');
}

function stripWhitespace(line) {
  const noSpaces = line.replace(/\s/g, '');  // remove spaces
  return noSpaces.includes('/') ?
    noSpaces.substring(0, noSpaces.indexOf('/')):
    noSpaces;
}
