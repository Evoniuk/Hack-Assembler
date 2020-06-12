function assemble(code) {
  for (let i = 0; i < code.length; i++) {
    if (code[i][0] === '@')
      code[i] = assembleAinstruction(code[i]);
    else code[i] = assembleCinstruction(code[i]);
  }

  return code;
}

function assembleAinstruction(line) {
  let num = line.substring(1);
  num = parseInt(num, 10).toString(2);

  let result = '0';
  for (let i = 0; i < 15 - num.length; i++)
    result += '0';

  return result + num;
}

function assembleCinstruction(line) {
  const [dest, comp, jump] = parseCinstruction(line);
  destCode = getDestCode(dest);
  compCode = getCompCode(comp);
  jumpCode = getJumpCode(jump);

  return '111' + compCode + destCode + jumpCode;
}

function parseCinstruction(line) {
  // splits into [dest, comp, jmp]
  let splitLine = line.split(/[=;]+/);
  if (!line.includes('=')) splitLine = [''].concat(splitLine);
  if (!line.includes(';')) splitLine.push('');

  return splitLine;
}

function getDestCode(dest) {
  const d1 = dest.includes('A') ? '1' : '0';
  const d2 = dest.includes('D') ? '1' : '0';
  const d3 = dest.includes('M') ? '1' : '0';
  return d1 + d2 + d3;
}

function getCompCode(comp) {
  const aBit = comp.includes('M') ? '1' : '0';

  comp = comp.replace(/A|M/, 'X');
  const cBits =
    comp === '0'   ? '101010':
    comp === '1'   ? '111111':
    comp === '-1'  ? '111010':
    comp === 'D'   ? '001100':
    comp === 'X'   ? '110000':
    comp === '!D'  ? '001101':
    comp === '!X'  ? '110001':
    comp === '-D'  ? '001111':
    comp === '-X'  ? '110011':
    comp === 'D+1' ? '011111':
    comp === 'X+1' ? '110111':
    comp === 'D-1' ? '001110':
    comp === 'X-1' ? '110010':
    comp === 'D+X' ? '000010':
    comp === 'D-X' ? '010011':
    comp === 'X-D' ? '000111':
    comp === 'D&X' ? '000000':
                     '010101';

  return aBit + cBits;
}

function getJumpCode(jump) {
  return jump === '' ? '000':
    jump === 'JGT' ? '001':
    jump === 'JEQ' ? '010':
    jump === 'JGE' ? '011':
    jump === 'JLT' ? '100':
    jump === 'JNE' ? '101':
    jump === 'JLE' ? '110':
                     '111';
}
