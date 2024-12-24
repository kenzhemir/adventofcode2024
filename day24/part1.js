const fs = require("fs");
function parseInput() {
  let [registers, gates] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  registers = Object.fromEntries(
    registers.split("\n").map((line) => {
      const [key, value] = line.split(": ");
      return [key, parseInt(value)];
    })
  );
  gates = gates.split("\n").map((line) => {
    const [expr, output] = line.split(" -> ");
    const [left, op, right] = expr.split(" ");
    return { left, op, right, output };
  });
  return { registers, gates };
}
Array.prototype.tap = function () {
  console.log(this);
  return this;
};

//-----------

console.log(solve());

//-----------

function getValue(value, registers) {
  return registers[value];
}

function solve({ registers, gates } = parseInput()) {
  for (let i = 0; i < 1001; i++)
    for (let gate of gates) {
      let left = getValue(gate.left, registers);
      let right = getValue(gate.right, registers);
      let value;
      switch (gate.op) {
        case "AND":
          value = left & right;
          break;
        case "OR":
          value = left | right;
          break;
        case "XOR":
          value = left ^ right;
          break;
        default:
          throw new Error("Invalid operator");
      }
      registers[gate.output] = value;
    }
  console.log(registers);
  return output(registers);
}
function output(registers) {
  return parseInt(
    Object.keys(registers)
      .filter((register) => register.startsWith("z"))
      .map((register) => parseInt(register.slice(1)))
      .sort((a, b) => b - a)
      .map((regNum) => registers[`z${(regNum + "").padStart(2, "0")}`])
      .join(""),
    2
  );
}
