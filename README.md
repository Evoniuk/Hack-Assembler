# Hack Assembler

This is an assembler from the Hack assembly language into the Hack machine language. [Try for yourself here](https://evoniuk.github.io/Hack-Assembler/).

## How It Works

This assembler works in three main stages.

1. First, it splits the file line-by-line and removes comments (both line and inline), returning an array.

2. Next, it looks through and finds symbols, adding them to a symbol table, and then substitutes the symbols with their values in the code, returning an array.

3. Finally, the cleaned-up code is passed to the assembler, which assembles each line according to [the Hack specification](https://b1391bd6-da3d-477d-8c01-38cdf774495a.filesusr.com/ugd/44046b_d70026d8c1424487a451eaba3e372132.pdf).

These stages are implemented in parser.js, handleSymbols.js, and assemble.js respectively.

#### A Note on the Architecture

It is worth noting that each of these phases is done functionally. Assembly as a process is conceptually functional, so it makes sense to approach a program that accomplishes it the same way. The only functions that are not functional are `enterLabelsIntoSymbolTable` and `enterVarsIntoSymbolTable` in `handleSymbols.js`, which have no return value and merely mutate the state of the symbol table in order to include the user-declared symbols.

Especially given that the task at hand is fundamentally procedural, any attempt at approaching it in an object-oriented way would inevitably lead to the creation of utility classes, which, as has been mathematically proven and divinely confirmed, are abominations.

### Parser

The parser is by far the most simple part of the program. The main function, `parse`, simply splits the input into lines, passes it to `stripWhitespace`, and returns a filtered array without empty lines. `stripWhitespace` does exactly as you might expect, removing spaces and comments.

### Handle Symbols

The function that handles symbols is, as you might expect, `handleSymbols`. It starts with a symbol table, implemented as an object, initialized with the pre-defined symbols in the Hack language. Then, two functions are called, enterLabelsIntoSymbolTable` and `enterVarsIntoSymbolTable`, which add to the symbol table all labels and variables created by the user.

Once the symbol table has recorded all the symbols in the code, we can safely remove the labels from the code. After that, `replaceVars` looks through each line of code and replaces instances of symbols with the values they represent.

This accomplished the goal of handling the symbols, so we then return the result as an array.

### Assemble

`assemble` is the function that coordinates the assembly of the code. It is implemented as follows:

```js
function assemble(code) {
  return code.map(line => line[0] === '@' ?
    assembleAinstruction(line):
    assembleCinstruction(line));
}
```

The condition tests if the line is an A instruction, and if so we assemble the A instruction, otherwise we know the line is a C instruction, so we perform that assembly.

#### Assembling an A Instruction

`assembleAinstruction` is a relatively straightforward function, as A instructions are relatively straightforward. It takes the number present in the instruction, converts it to binary, and adds a sufficient number of leading zeroes to make it a 16-bit instruction. This is what `assembleAinstruction` returns.

#### Assembling a C Instruction

`assembleCinstruction` starts by parsing the C instruction, splitting it into an array [destination, computation, jump], the three fields of any C instruction. Each of these are then translated into their binary equivalent then combined in the proper order with a leading `111`, as detailed in the specification.

## Example

An example program might be the following, which draws a rectangle on the screen:

```asm
   @0
   D=M
   @INFINITE_LOOP
   D;JLE
   @counter
   M=D
   @SCREEN
   D=A
   @address
   M=D
(LOOP) // main loop
   @address
   A=M
   M=-1
   @address
   D=M
   @32
   D=D+A
   @address
   M=D
   @counter
   MD=M-1
   @LOOP
   D;JGT
(INFINITE_LOOP)     // keeps program from
   @INFINITE_LOOP   // accessing other code
   0;JMP
```

The parser produces the following from this input:

```asm
@0
D=M
@INFINITE_LOOP
D;JLE
@counter
M=D
@SCREEN
D=A
@address
M=D
(LOOP)
@address
A=M
M=-1
@address
D=M
@32
D=D+A
@address
M=D
@counter
MD=M-1
@LOOP
D;JGT
(INFINITE_LOOP)
@INFINITE_LOOP
0;JMP
```

After this, `handleSymbols` produces this:

```asm
@0
D=M
@23
D;JLE
@16
M=D
@16384
D=A
@17
M=D
@17
A=M
M=-1
@17
D=M
@32
D=D+A
@17
M=D
@16
MD=M-1
@10
D;JGT
@23
0;JMP
```

From which the assembler assembles

```
0000000000000000
1111110000010000
0000000000010111
1110001100000110
0000000000010000
1110001100001000
0100000000000000
1110110000010000
0000000000010001
1110001100001000
0000000000010001
1111110000100000
1110111010001000
0000000000010001
1111110000010000
0000000000100000
1110000010010000
0000000000010001
1110001100001000
0000000000010000
1111110010011000
0000000000001010
1110001100000001
0000000000010111
1110101010000111
```
