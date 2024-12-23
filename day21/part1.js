const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n");
}

const codePositions = {
  7: [0, 0],
  8: [0, 1],
  9: [0, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  1: [2, 0],
  2: [2, 1],
  3: [2, 2],
  0: [3, 1],
  A: [3, 2],
  skip: [3, 0],
};
const controlPositions = {
  "^": [0, 1],
  ">": [1, 2],
  v: [1, 1],
  "<": [1, 0],
  A: [0, 2],
  skip: [0, 0],
};
let DEPTH = Number(process.argv[2]);

Array.prototype.tap = function () {
  debug("Tap", this);
  return this;
};

const enableDebug = false;
const debug = enableDebug ? console.log : () => {};

const memo = {};

//-----------

console.log(solve());

//-----------

function solve(input = parseInput()) {
  let sum = 0;
  for (let code of input) {
    let len_of_control = getLengthOfCode(code);
    console.log({ code, len_of_control });
    sum += len_of_control * parseInt(code);
  }

  return sum;
}

function minLen(a, b) {
  return Math.min(a, b.length);
}
function sum(a, b) {
  return a + b;
}
function min(acc, b) {
  return Math.min(acc, b);
}

/**
 *
 * @param {any[][]} arrs
 * @returns {any[]}
 */
function smallest(arrs) {
  return arrs.reduce((curr, el) => {
    if (curr.length < el.length) {
      return curr;
    }
    return el;
  });
}

function getLengthOfCode(code) {
  let controlSequences = getAllSequences(code.split(""), codePositions).flatMap(
    (alts) => {
      const altSequences = alts.map((alt) =>
        getSmallestControl(alt, controlPositions, 0)
      );
      return smallest(altSequences);
    }
  );
  // console.dir({ controlSequences: controlSequences.join("").split("A").slice(0, -1).sort().join("A") }, { depth: 10 });
  console.dir({ controlSequences: controlSequences.join("") }, { depth: 10 });
  return controlSequences.length;
}

/**
 *
 * @param {*} code
 * @param {*} positions
 * @param {*} depth
 * @returns {any[]}
 */
function getSmallestControl(code, positions, depth) {
  const tabulation = new Array(depth).fill("\t").join("");
  debug(tabulation, {
    code: code.join(""),
    depth,
  });
  if (depth == DEPTH) {
    debug(tabulation, "returning", code.length, code.join(""));
    return code;
  }
  const altSequences = getAllSequences(code, positions).flatMap((alts) => {
    return smallest(
      alts.map((alt) => getSmallestControl(alt, positions, depth + 1))
    );
  });
  debug(tabulation, "returning", altSequences.length, altSequences.join(""));
  return altSequences;
}

function getAllSequences(input, positions) {
  let key = input.join("");
  if (memo[key]) {
    return memo[key];
  }
  let sequences = [];
  let start = positions["A"];
  for (let i = 0; i < input.length; i++) {
    let target = positions[input[i]];
    let allMovements = getAllManhattanMovements(
      start,
      target,
      positions.skip
    ).map((movement) => {
      movement.push("A");
      return movement;
    });
    sequences.push(allMovements);
    start = target;
  }
  memo[key] = sequences;
  return sequences;
}

function getAllManhattanMovements([row1, col1], [row2, col2], [rowS, colS]) {
  let movementsX = [];
  let movementsY = [];
  let diffRow = row2 - row1;
  let diffCol = col2 - col1;
  if (diffCol > 0) {
    movementsX = Array(diffCol).fill(">");
  } else {
    movementsX = Array(-diffCol).fill("<");
  }
  if (diffRow < 0) {
    movementsY = Array(-diffRow).fill("^");
  } else {
    movementsY = Array(diffRow).fill("v");
  }

  if (rowS == row1 && colS == col2) {
    return [movementsY.concat(movementsX)];
  }
  if (rowS == row2 && colS == col1) {
    return [movementsX.concat(movementsY)];
  }

  return [movementsX.concat(movementsY), movementsY.concat(movementsX)];
}
