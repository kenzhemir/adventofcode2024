function parseInput() {
  const fs = require("fs");
  return fs.readFileSync(require("path").join(__dirname, "input.txt"), "utf-8");
}

console.log(
  interpreter(
    "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
  )
);

// console.log(interpreter());

function interpreter(input = parseInput()) {
  const mulToken = "mul(";
  let sum = 0;
  let cursor = 0;
  while (cursor < input.length) {
    cursor = seekSubstring(input, cursor, mulToken);
    [cursor, leftOperand] = consumeNumber(input, cursor);
    [cursor, commaExists] = consumeCharacter(input, cursor, ",");
    [cursor, rightOperand] = consumeNumber(input, cursor);
    [cursor, closingBracketExists] = consumeCharacter(input, cursor, ")");
    if (
      leftOperand != "" &&
      commaExists &&
      rightOperand != "" &&
      closingBracketExists
    ) {
      console.log("mul(" + leftOperand + "," + rightOperand + ")");
      sum += parseInt(leftOperand) * parseInt(rightOperand);
    }
  }
  return sum;
}

function seekSubstring(input, cursor, substr) {
  let pointer = 0;
  while (cursor < input.length && pointer < substr.length) {
    if (input[cursor] == substr[pointer]) {
      pointer++;
    }
    cursor++;
  }
  return cursor;
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
