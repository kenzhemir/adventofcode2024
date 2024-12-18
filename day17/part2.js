const fs = require("fs");
function parseInput() {
  let [registers, program] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  const [A, B, C] = registers
    .split("\n")
    .map((line) => line.split(": ")[1])
    .map(Number);
  program = program.split(": ")[1].split(",").map(Number);
  return { registers: { A, B, C }, program };
}

const comboOperands = [
  () => 0,
  () => 1,
  () => 2,
  () => 3,
  (registers) => registers["A"], // 4
  (registers) => registers["B"], // 5
  (registers) => registers["C"], // 6
];

const instructions = [
  {
    name: "adv",
    opcode: 0,
    operandType: "combo",
    execute(registers, operand, instructions_pointer) {
      const numerator = registers["A"];
      const denominatorPower = comboOperands[operand](registers);
      registers["A"] = Math.floor(numerator / Math.pow(2, denominatorPower));
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
      const lowest3bits = comboOperands[operand](registers) & 7;
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
      const value = comboOperands[operand](registers) & 7;
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
      const denominatorPower = comboOperands[operand](registers);
      registers["B"] = Math.floor(numerator / Math.pow(2, denominatorPower));
      return instructions_pointer + 2;
    },
  },
  {
    name: "cdv",
    opcode: 7,
    operandType: "combo",
    execute(registers, operand, instructions_pointer) {
      const numerator = registers["A"];
      const denominatorPower = comboOperands[operand](registers);
      registers["C"] = Math.floor(numerator / Math.pow(2, denominatorPower));
      return instructions_pointer + 2;
    },
  },
];

// 35184372088833
// 106086382266778
// 281474976710656

const InstructionsArray = instructions.sort((a, b) => a.opcode - b.opcode);
const START = 106086382266778; //35184372088833;
const STEP = 1;
const ENDDD = 234971388024585; // 281474976710656;

const earlyExit = false;

const analysis = false;
const analysisLog = analysis ? console.log : () => {};
const analysisLimit = START + 0;

const debug = false;
const debugLogCollector = [];
const debugLog = debug
  ? (obj) => {
      debugLogCollector.push(obj);
    }
  : () => {};

const patterns = [
  {
    name: "000",
    xor: 0 ^ 3,
    shifts: 0 ^ 5,
    add: 0,
  },
  {
    name: "001",
    xor: 1 ^ 3,
    shifts: 1 ^ 5,
    add: 1,
  },
  {
    name: "010",
    xor: 2 ^ 3,
    shifts: 2 ^ 5,
    add: 2,
  },
  {
    name: "011",
    xor: 3 ^ 3,
    shifts: 3 ^ 5,
    add: 3,
  },
  {
    name: "100",
    xor: 4 ^ 3,
    shifts: 4 ^ 5,
    add: 4,
  },
  {
    name: "101",
    xor: 5 ^ 3,
    shifts: 5 ^ 5,
    add: 5,
  },
  {
    name: "110",
    xor: 6 ^ 3,
    shifts: 6 ^ 5,
    add: 6,
  },
  {
    name: "111",
    xor: 7 ^ 3,
    shifts: 7 ^ 5,
    add: 7,
  },
];
//-----------

// console.log(patternMatchReverse());
console.log(patternMatchProper());
// console.log(fixCorruptedRegister());
if (debug) console.table(debugLogCollector);

//-----------

function patternMatchProper({ program } = parseInput()) {
  let min = Infinity;
  let stack = [{ result: "", index: program.length - 1 }];
  while (stack.length) {
    let { result, index } = stack.pop();

    if (index < 0) {
      min = Math.min(min, parseInt(result, 2));
      continue;
    }
    let num = program[index];

    let bits = [];
    for (let aval = 0; aval < 8; aval++) {
      console.log({
        num,
        try: result + aval.toString(2).padStart(3, "0"),
        result: interpret(
          {
            program,
            registers: {
              A: parseInt(result + aval.toString(2).padStart(3, "0"), 2),
              B: 0,
              C: 0,
            },
          },
          (output) => output.length == 1
        ),
      });
      if (
        num ==
        interpret(
          {
            program,
            registers: {
              A: parseInt(result + aval.toString(2).padStart(3, "0"), 2),
              B: 0,
              C: 0,
            },
          },
          (output) => output.length == 1
        )
      ) {
        bits.push(aval);
      }
    }
    bits.forEach((bit) => {
      stack.push({
        result: result + bit.toString(2).padStart(3, "0"),
        index: index - 1,
      });
    });
  }
  return min;
}

function patternMatchReverse({ program } = parseInput()) {
  let stack = [{ revResult: new Array(60).fill("x"), index: 0 }];
  let min = Infinity;
  let logs = 0;
  while (stack.length) {
    if (logs++ < 100)
      console.table(
        stack.map(({ revResult, index }) => {
          return {
            index,
            result: revResult
              .map((x) => (x == undefined ? 0 : x))
              .reverse()
              .join(""),
          };
        })
      );
    let { revResult, index } = stack.pop();
    if (index == program.length) {
      min = Math.min(
        min,
        parseInt(
          revResult
            .map((x) => (x == "x" ? 0 : x))
            .reverse()
            .join(""),
          2
        )
      );
      continue;
    }
    let leftEdge = index * 3;
    let num = program[index];
    for (let { xor, shifts, add } of patterns) {
      let newRevResult = [...revResult];
      // match lower bits
      const lowerBits = add;

      let lowerPatternArr = newRevResult
        .slice(leftEdge, leftEdge + 3)
        .reverse();
      let lowerPattern = parseInt(
        lowerPatternArr.map((bit) => (bit == "x" ? 0 : bit)).join(""),
        2
      );
      let skipMaskLower = parseInt(
        lowerPatternArr.map((bit) => (bit == "x" ? 0 : 1)).join(""),
        2
      );
      if ((lowerBits & skipMaskLower) != lowerPattern) continue;

      newRevResult[leftEdge] = lowerBits & 1;
      newRevResult[leftEdge + 1] = (lowerBits >> 1) & 1;
      newRevResult[leftEdge + 2] = (lowerBits >> 2) & 1;
      // match upper bits
      let upperBits = num ^ xor;
      if (index == 0) console.log({ upperBits, num, xor });
      let upperPatternArr = newRevResult
        .slice(leftEdge + shifts, leftEdge + shifts + 3)
        .reverse();
      let upperPattern = parseInt(
        upperPatternArr.map((bit) => (bit == "x" ? 0 : bit)).join(""),
        2
      );
      let skipMask = parseInt(
        upperPatternArr.map((bit) => (bit == "x" ? 0 : 1)).join(""),
        2
      );

      if ((upperBits & skipMask) != upperPattern) continue;

      newRevResult[leftEdge + shifts] = upperBits & 1;
      newRevResult[leftEdge + shifts + 1] = (upperBits >> 1) & 1;
      newRevResult[leftEdge + shifts + 2] = (upperBits >> 2) & 1;
      stack.push({ revResult: newRevResult, index: index + 1 });
    }
  }
  return min;
}

function plainTextProgram({ program } = parseInput()) {
  return program
    .reduce((acc, val, i, arr) => {
      if (i % 2 == 1) return acc;
      const opcode = val;
      const operand = arr[i + 1];
      acc.push(`${InstructionsArray[opcode].name} ${operand}`);
      return acc;
    }, [])
    .join("\n");
}

function fixCorruptedRegister({ program, registers } = parseInput()) {
  const expectedOutput = program.join(",");
  analysisLog("Expected output: ", expectedOutput);

  let output;
  registers["A"] = START - STEP;
  do {
    registers["A"] += STEP;
    output = interpret(
      structuredClone({ program, registers }),
      earlyExit
        ? (output) => {
            return !expectedOutput.startsWith(output);
          }
        : null
    );
    analysisLog(
      `Trying A = ${registers["A"]}, Result: ${output}, len: ${
        output.split(",").length
      }`
    );
  } while (
    output !== expectedOutput &&
    (!analysis || registers["A"] < analysisLimit)
  );

  return registers["A"];
}

function interpret({ program, registers } = parseInput(), earlyExit) {
  let instructions_pointer = 0;
  const output = [];
  while (instructions_pointer < program.length) {
    const opcode = program[instructions_pointer];
    const operand = program[instructions_pointer + 1];
    const instruction = InstructionsArray[opcode];
    instructions_pointer = instruction.execute(
      registers,
      operand,
      instructions_pointer,
      output
    );
    debugLog({
      p: instructions_pointer,
      opcode,
      instruction: instruction.name,
      operand,
      registers: JSON.stringify(registers),
      output: output.join(","),
    });
    if (earlyExit && earlyExit(output.join(","))) break;
  }
  return output.join(",");
}
