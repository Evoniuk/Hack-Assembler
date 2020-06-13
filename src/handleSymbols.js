function handleSymbols(code) {
  const symbolTable = {
    R0:  0,
    R1:  1,
    R2:  2,
    R3:  3,
    R4:  4,
    R5:  5,
    R6:  6,
    R7:  7,
    R8:  8,
    R9:  9,
    R10: 10,
    R11: 11,
    R12: 12,
    R13: 13,
    R14: 14,
    R15: 15,
    SCREEN: 16384,
    KBD:    24576,
    SP:   0,
    LCL:  1,
    ARG:  2,
    THIS: 3,
    THAT: 4,
  };

  enterLabelsIntoSymbolTable(code, symbolTable);
  enterVarsIntoSymbolTable(code, symbolTable);

  const noLabels = code.filter(line => line[0] !== '(');
  return replaceVars(noLabels, symbolTable);
}

function enterLabelsIntoSymbolTable(code, symbolTable) {
  let numberOfLabelsSeen = 0;
  for (let i = 0; i < code.length; i++)
    if (code[i][0] === '(')
      symbolTable[code[i].substring(1, code[i].length - 1)]
        = i - numberOfLabelsSeen++;
}

function enterVarsIntoSymbolTable(code, symbolTable) {
  let variableIndex = 16;
  for (let i = 0; i < code.length; i++)
    if (lineIsNewVariable(code[i], symbolTable))
      symbolTable[code[i].substring(1)] = variableIndex++;
}

function replaceVars(code, symbolTable) {
  return code.map(line => line[0] === '@' && line.substring(1) in symbolTable ?
    '@' + symbolTable[line.substring(1)]:
    line);
}

function lineIsNewVariable(line, symbolTable) {
  return line[0] === '@'  &&
  line[1].match(/[^0-9]/) &&
  !(line.substring(1) in symbolTable);
}
