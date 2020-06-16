function assemble(code) {
  return code.map(line => line[0] === '@' ?
    assembleAinstruction(line):
    assembleCinstruction(line));
}

function assembleAinstruction(line) {
  const num = line.substring(1);
  const binaryNum = parseInt(num, 10).toString(2);
  const leadingZeros = '0'.repeat(16 - binaryNum.length);

  return leadingZeros + binaryNum;
}

function assembleCinstruction(line) {
  const [dest, comp, jump] = parseCinstruction(line);
  const destCode = getDestCode(dest);
  const compCode = getCompCode(comp);
  const jumpCode = getJumpCode(jump);

  return '111' + compCode + destCode + jumpCode;
}

function parseCinstruction(line) {
  // splits into [dest, comp, jmp]
  const splitLine = line.split(/[=;]+/);
  if (!line.includes('=')) splitLine.unshift('')
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

  const compute = comp.replace(/A|M/, 'X');
  const cBits =
    compute === '0'   ? '101010':
    compute === '1'   ? '111111':
    compute === '-1'  ? '111010':
    compute === 'D'   ? '001100':
    compute === 'X'   ? '110000':
    compute === '!D'  ? '001101':
    compute === '!X'  ? '110001':
    compute === '-D'  ? '001111':
    compute === '-X'  ? '110011':
    compute === 'D+1' ? '011111':
    compute === 'X+1' ? '110111':
    compute === 'D-1' ? '001110':
    compute === 'X-1' ? '110010':
    compute === 'D+X' ? '000010':
    compute === 'D-X' ? '010011':
    compute === 'X-D' ? '000111':
    compute === 'D&X' ? '000000':
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
