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
  gates = textSwap(gates, "-> gvw", "-> qjb");
  gates = textSwap(gates, "-> jgc", "-> z15");
  gates = textSwap(gates, "-> drg", "-> z22");
  gates = textSwap(gates, "-> jbp", "-> z35")
  gates = gates.split("\n").map((line) => {
    const [expr, output] = line.split(" -> ");
    const [left, op, right] = expr.split(" ");
    return { left, op, right, output };
  });
  return { registers, gates };
}

function textSwap(text, a, b) {
  return text.split(a).join("TEMP").split(b).join(a).split("TEMP").join(b);
}

Array.prototype.tap = function () {
  console.log(this);
  return this;
};

class Node {
  leftValue = null;
  rightValue = null;
  depth = 0;
  isNegated = false;
  constructor(name, op, left, right) {
    this.name = name;
    this.op = op;
    this.left = left;
    this.right = right;
  }
}
//-----------

console.log(solve());

//-----------

function getValue(value, registers) {
  return registers[value];
}

function generateRegisters(x, y) {
  let xBits = x.toString(2).padStart(45, "0").split("").reverse();
  let yBits = y.toString(2).padStart(45, "0").split("").reverse();
  let registers = {};
  for (let i = 0; i < 45; i++) {
    registers[`x${(i + "").padStart(2, "0")}`] = parseInt(xBits[i]);
    registers[`y${(i + "").padStart(2, "0")}`] = parseInt(yBits[i]);
  }
  return registers;
}

function getBitKey(label, bit) {
  return `${label}${(bit + "").padStart(2, "0")}`;
}

function solve({ registers, gates } = parseInput()) {
  let nodeRegistry = backpropagate(registers, gates);

  let currCarry;
  for (let i = 0; i < 45; i++) {
    let z = getBitKey("z", i);
    let x = getBitKey("x", i);
    let y = getBitKey("y", i);
    console.log("checking", { x, y, z, currCarry: currCarry?.name });
    let carryNode = verifyXor(nodeRegistry[z], x, y);
    if (currCarry != carryNode) {
      throw new Error("Carry mismatch");
    }
    let andGate = findGate(
      nodeRegistry,
      "AND",
      nodeRegistry[x],
      nodeRegistry[y]
    );
    if (!currCarry) {
      currCarry = andGate;
      continue;
    }
    let xorGate = findGate(
      nodeRegistry,
      "XOR",
      nodeRegistry[x],
      nodeRegistry[y]
    );
    let andXorGate = findGate(nodeRegistry, "AND", xorGate, currCarry);
    let orGate = findGate(nodeRegistry, "OR", andGate, andXorGate);
    currCarry = orGate;
  }
}

function verifyXor(node, x, y) {
  // console.log({ node });
  if (node.op !== "XOR") {
    throw new Error("Not an XOR gate");
  }
  let { left, right } = node;
  if (![x, y].includes(left.name) && ![x, y].includes(right.name)) {
    // balanced
    let [xorNode, otherNode] =
      left.op === "XOR" ? [left, right] : [right, left];
    let { left: left2, right: right2 } = xorNode;
    if (
      (left2.name === x && right2.name === y) ||
      (left2.name === y && right2.name === x)
    ) {
      return otherNode;
    } else {
      throw new Error("Not XOR with X and Y in balanced nodes");
    }
  }
  // let names = [left, right].sort((a, b) => (a.name > b.name ? 1 : -1));
  let [xORyNode, otherNode] = [x, y].includes(left.name)
    ? [left, right]
    : [right, left];

  // console.log({ xORyNode, otherNode });
  if (xORyNode.name != x && xORyNode.name != y) {
    throw new Error("Not X or Y node");
  }

  if ([x, y].includes(otherNode.name)) {
    return undefined;
  }
  if (otherNode.op !== "XOR") {
    throw new Error("other node is not XOR");
  }
  ({ left, right } = otherNode);
  let [otherXOrY, carryNode] = [x, y].includes(left.name)
    ? [left, right]
    : [right, left];
  if (otherXOrY.name !== x && otherXOrY.name !== y) {
    throw new Error("Not X or Y node level 2");
  }
  return carryNode;
}

function findGate(nodeRegistry, op, node1, node2) {
  for (let node of Object.values(nodeRegistry)) {
    if (
      node.op === op &&
      ((node.left?.name === node1.name && node.right?.name === node2.name) ||
        (node.right?.name === node1.name && node.left?.name === node2.name))
    ) {
      return node;
    }
  }
  console.log(op, node1.name, node2.name);
  throw new Error("Gate not found");
}

function sameSets(set1, set2) {
  return (
    set1.length === set2.length && [...set1].every((value) => set2.has(value))
  );
}

function backpropagate(registers, gates, target) {
  let nodeRegistry = {};
  let getNode = (name) =>
    nodeRegistry[name] || (nodeRegistry[name] = new Node(name));
  for (let { left, right, op, output } of gates) {
    let leftNode = getNode(left);
    let rightNode = getNode(right);
    let outputNode = getNode(output);
    outputNode.op = op;
    outputNode.left = leftNode;
    outputNode.right = rightNode;
  }

  let bit = 0;
  let getBitKey = (bit) => `z${(bit + "").padStart(2, "0")}`;
  let memo = {};
  let output = "";
  while (getBitKey(bit) in nodeRegistry) {
    let res = traverse(nodeRegistry[getBitKey(bit)], registers, memo, true);
    output = res + output;
    bit++;
  }

  return nodeRegistry;

  // console.table(
  //   Object.values(nodeRegistry)
  //     .sort((a, b) => a.depth - b.depth || (a.name > b.name ? 1 : -1))
  //     .map((node) => ({
  //       name: node.name,
  //       op: node.op,
  //       left: node.left?.name + "(" + node.left?.depth + ")",
  //         right: node.right?.name + "(" + node.right?.depth + ")",
  //       depth: node.depth,
  //     }))
  // );

  // let targetBinary = target.toString(2).split("").reverse();
  // bit = 0;
  // let correct = true;
  // while (getBitKey(bit) in nodeRegistry) {
  //   let node = nodeRegistry[getBitKey(bit)];
  //   // console.log(node.name, allBaseBits(node));
  //   let res = node.value;
  //   let targetBit = targetBinary[bit] === "1" ? 1 : 0;
  //   if (res !== targetBit) {
  //     console.log("flipping", bit, targetBit, res, node.depth);
  //     correct = false;
  //   }
  //   bit++;
  // }
  // return correct;
}

function allBaseBits(node) {
  let bits = [];
  if (node.op === undefined) {
    return [node.name];
  }
  bits.push(...allBaseBits(node.left));
  bits.push(...allBaseBits(node.right));
  return bits;
}

function findFlippableGates(nodeRegistry) {
  let allNodes = Object.values(nodeRegistry);
  let positiveNodes = allNodes.filter(
    (node) => node.value === 1 && !node.name.startsWith("z")
  );
  let negativeNodes = allNodes.filter((node) => node.value === 0);
  console.log({ lenPos: positiveNodes.length, lenNeg: negativeNodes.length });
  let allPositiveCombintaions = allCombinationsOf4(positiveNodes);
  let allNegativeCombintaions = allCombinationsOf4(negativeNodes);
  console.log({
    lenPos: allPositiveCombintaions.length,
    lenNeg: allNegativeCombintaions.length,
  });
  // let allFlips = allPermutations(
  //   allPositiveCombintaions,
  //   allNegativeCombintaions
  // );
  // console.log(allFlips.length);

  return allFlips;
}

function allPermutations(arr1, arr2) {
  let output = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      output.push([arr1[i], arr2[j]]);
    }
  }
}

function allCombinationsOf4(arr) {
  let result = [];
  for (let i = 0; i < arr.length - 3; i++) {
    for (let j = i + 1; j < arr.length - 2; j++) {
      for (let k = j + 1; k < arr.length - 1; k++) {
        for (let l = k + 1; l < arr.length; l++) {
          result.push([arr[i], arr[j], arr[k], arr[l]]);
        }
      }
    }
  }
  return result;
}

function traverse(node, registers, memo, remember = false, depth = 0) {
  if (node.op === undefined) {
    return { value: registers[node.name], depth: 0 };
  }
  // if (node.name in memo) {
  //   return memo[node.name];
  // }

  let { value: leftValue, depth: leftDepth } = traverse(
    node.left,
    registers,
    memo,
    remember,
    depth + 1
  );
  let { value: rightValue, depth: rightDepth } = traverse(
    node.right,
    registers,
    memo,
    remember,
    depth + 1
  );
  node.depth = Math.max(node.depth, leftDepth + 1, rightDepth + 1);
  let value;
  switch (node.op) {
    case "AND":
      value = leftValue & rightValue;
      break;
    case "OR":
      value = leftValue | rightValue;
      break;
    case "XOR":
      value = leftValue ^ rightValue;
      break;
    default:
      throw new Error("Invalid operator");
  }
  if (node.isNegated) {
    value = value ? 0 : 1;
  }
  if (remember) node.value = value;
  if (remember) node.leftValue = leftValue;
  if (remember) node.rightValue = rightValue;
  // memo[node.name] = value;
  return { value, depth: node.depth };
}

function output(registers, label) {
  return parseInt(
    Object.keys(registers)
      .filter((register) => register.startsWith(label))
      .map((register) => parseInt(register.slice(1)))
      .sort((a, b) => b - a)
      .map((regNum) => registers[`${label}${(regNum + "").padStart(2, "0")}`])
      .join(""),
    2
  );
}
