const fs = require("fs");
function parseInput() {
  let [registers, program] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  const [A, B, C] = registers.split("\n").map((line) => line.split(": ")[1]);
  program = program.split(": ")[1].split(",").map(Number);
  return { registers: { A, B, C }, program };
}

const comboOperands = [
  () => 0,
  () => 1,
  () => 2,
  () => 3,
  (registers) => registers["A"],
  (registers) => registers["B"],
  (registers) => registers["C"],
];

const instructions = [
  {
    name: "adv",
    opcode: 0,
    operandType: "combo",
    execute(registers, operand, instructions_pointer) {
      const numerator = registers["A"];
      const denominator = 2 ** comboOperands[operand](registers);
      registers["A"] = Math.floor(numerator / denominator);
      return instructions_pointer + 2;
    },
  },
  {
    name: "bxl",
    opcode: 1,
    operandType: "literal",
    execute(registers, operand, instructions_pointer) {
      const left = registers["B"];
      const right = operand;
      registers["B"] = left ^ right;
      return instructions_pointer + 2;
    },
  },
  {
    name: "bst",
    opcode: 2,
    operandType: "combo",
    execute(registers, operand, instructions_pointer) {
      const lowest3bits = comboOperands[operand](registers) % 8;
      registers["B"] = lowest3bits;
      return instructions_pointer + 2;
    },
  },
  {
    name: "jnz",
    opcode: 3,
    operandType: "literal",
    execute(registers, operand, instructions_pointer) {
      if (registers["A"]) {
        return operand;
      }
      return instructions_pointer + 2;
    },
  },
  {
    name: "bxc",
    opcode: 4,
    operandType: "literal",
    execute(registers, _operand, instructions_pointer) {
      const left = registers["B"];
      const right = registers["C"];
      registers["B"] = left ^ right;
      return instructions_pointer + 2;
    },
  },
  {
    name: "out",
    opcode: 5,
    operandType: "combo",
    execute(registers, operand, instructions_pointer, output) {
      const value = comboOperands[operand](registers) % 8;
      output.push(value);
      return instructions_pointer + 2;
    },
  },
  {
    name: "adv",
    opcode: 6,
    operandType: "combo",
    execute(registers, operand, instructions_pointer) {
      const numerator = registers["A"];
      const denominator = 2 ** comboOperands[operand](registers);
      registers["B"] = Math.floor(numerator / denominator);
      return instructions_pointer + 2;
    },
  },
  {
    name: "cdv",
    opcode: 7,
    operandType: "combo",
    execute(registers, operand, instructions_pointer) {
      const numerator = registers["A"];
      const denominator = 2 ** comboOperands[operand](registers);
      registers["C"] = Math.floor(numerator / denominator);
      return instructions_pointer + 2;
    },
  },
];

const InstructionsArray = instructions.sort((a, b) => a.opcode - b.opcode);

//-----------

console.log(interpret());

//-----------

function interpret({ program, registers } = parseInput()) {
  let instructions_pointer = 0;
  const output = [];
  while (instructions_pointer < program.length) {
    const opcode = program[instructions_pointer];
    const operand = program[instructions_pointer + 1];
    const instruction = InstructionsArray[opcode];
    // console.log({
    //   instructions_pointer,
    //   opcode,
    //   operand,
    //   registers,
    //   output,
    //   instruction,
    // });
    instructions_pointer = instruction.execute(
      registers,
      operand,
      instructions_pointer,
      output
    );
  }
  return output.join(",");
}
