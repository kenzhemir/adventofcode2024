const PState = {
  Enabled: "enabled",
  Disabled: "disabled",
};
const mulToken = "mul(";
const doToken = "do()";
const dontToken = "don't()";
const tokensToSeek = {
  [PState.Enabled]: [mulToken, dontToken],
  [PState.Disabled]: [doToken],
};

function parseInput() {
  const fs = require("fs");
  return fs.readFileSync(require("path").join(__dirname, "input.txt"), "utf-8");
}

console.log(
  interpreter(
    "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
  )
);

// console.log(interpreter());

function interpreter(input = parseInput()) {
  let state = PState.Enabled;
  let sum = 0;
  let tokenFound, cursor = 0;
  while (cursor < input.length) {
    [cursor, tokenFound] = seekTokens(input, cursor, tokensToSeek[state]);
    switch (tokenFound) {
      case mulToken:
        [cursor, result] = consumeMulOperands(input, cursor);
        if (result) {
          sum += result;
        }
        break;
      case doToken:
        state = PState.Enabled;
        break;
      case dontToken:
        state = PState.Disabled;
        break;
    }
  }
  return sum;
}

function consumeMulOperands(input, cursor) {
  const originalCursor = cursor;
  [cursor, leftOperand] = consumeNumber(input, cursor);
  if (leftOperand == "") {
    return [originalCursor];
  }
  [cursor, commaExists] = consumeCharacter(input, cursor, ",");
  if (!commaExists) {
    return [originalCursor];
  }
  [cursor, rightOperand] = consumeNumber(input, cursor);
  if (rightOperand == "") {
    return [originalCursor];
  }
  [cursor, closingBracketExists] = consumeCharacter(input, cursor, ")");
  if (!closingBracketExists) {
    return [originalCursor];
  }
  return [cursor, parseInt(leftOperand) * parseInt(rightOperand)];
}

function seekTokens(input, cursor, tokens) {
  let pointers = new Array(tokens.length).fill(0);
  while (cursor < input.length) {
    for (let p = 0; p < pointers.length; p++) {
      if (input[cursor] == tokens[p][pointers[p]]) {
        pointers[p]++;
        if (pointers[p] == tokens[p].length) {
          return [cursor + 1, tokens[p]];
        }
      } else {
        pointers[p] = 0;
      }
    }
    cursor++;
  }
  return [cursor, null];
}

function consumeCharacter(input, cursor, character) {
  if (input[cursor] == character) {
    return [cursor + 1, true];
  } else {
    return [cursor, false];
  }
}

function consumeNumber(input, cursor) {
  let result = "";
  while (
    cursor < input.length &&
    input[cursor] >= "0" &&
    input[cursor] <= "9"
  ) {
    result += input[cursor];
    cursor++;
  }
  return [cursor, result];
}
