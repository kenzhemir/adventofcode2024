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

const moves = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

let constructs = {
  "<A": [1, 2], //0
  "v<<A": [3, 0, 4, 2], // 1
  ">>^A": [5, 4, 6, 7], // 2
  "v<A": [3, 0, 2], // 3
  A: [4], // 4
  vA: [3, 8], // 5
  "^<A": [0, 3, 2], // 6
  ">A": [5, 9], // 7
  "^>A": [0, 10, 9], // 8
  "^A": [0, 7], // 9
  "v>A": [3, 7, 9], // 10
  ">>A": [5, 4, 9], // 12
  "<<A": [1, 4, 2], // 13
};

const nodes = Object.keys(constructs);
const edges = Object.values(constructs);

const controlMoves = {
  A: {
    "^": "<A", // 0
    "<": "v<<A", // 1
    ">": "vA", // 5
    A: "A", // 4
    v: "v<A", // 3
  },
  "<": {
    "^": "^>A", // 11
    "<": "A", // 4
    ">": ">>A", // 12
    A: ">>^A", // 2
    v: ">A", // 7
  },
  v: {
    "^": "^A", // 9
    "<": "<A", // 0
    ">": ">A", // 7
    A: "^>A", // 8
    v: "A", // 4
  },
  ">": {
    "^": "^<A", // 6
    "<": "<<A", // 13
    ">": "A", // 4
    A: "^A", // 9
    v: "<A", // 0
  },
  "^": {
    "^": "A", // 4
    "<": "v<A", // 3
    ">": "v>A", // 10
    A: ">A", // 7
    v: "vA", // 5
  },
};

Array.prototype.tap = function () {
  console.log("Tap", this);
  return this;
};

const enableDebug = false;
const debug = enableDebug ? console.log : () => {};

const memo = {};

let DEPTH = Number(process.argv[2]) - 1;

//-----------

console.log(solve());
// console.log(bfs(0, 25));

//-----------

function bfs(node, depth) {
  let queue = new Array(nodes.length).fill(0);
  queue[node] = 1;

  for (let i = 0; i < depth; i++) {
    let nextQueue = new Array(nodes.length).fill(0);
    for (let i = 0; i < queue.length; i++) {
      if (queue[i]) {
        for (let j = 0; j < edges[i].length; j++) {
          nextQueue[edges[i][j]] += queue[i];
        }
      }
    }
    queue = nextQueue;
  }

  return {
    queue,
    count: queue
      .map((count, i) => count * nodes[i].length)
      .reduce((a, b) => a + b),
  };
}

function getConrolNodes(code) {
  let start = "A";
  let out = [];
  for (let i = 0; i < code.length; i++) {
    let target = code[i];
    let node = nodes.indexOf(controlMoves[start][target]);
    out.push(node);
    start = target;
  }
  return out;
}

function solve(input = parseInput()) {
  let sum = 0;
  for (let code of input) {
    let len_of_control = getLengthOfCode(code);
    console.log({ code, len_of_control });
    sum += len_of_control * parseInt(code);
  }

  return sum;
}

function sum(arr1, arr2) {
  return arr1.map((a, i) => a + arr2[i]);
}
function getLengthOfCode(code) {
  let controlSequences = getAllSequences(code.split(""), codePositions).map(
    (alts) => {
      // console.log({ alts });
      const altSequences = alts.map((alt) => {
        let formatted = getConrolNodes(alt);
        return formatted
          .map((nodeIdx) => bfs(nodeIdx, DEPTH))
          .reduce((a, b) => ({
            queue: sum(a.queue, b.queue),
            count: a.count + b.count,
          }));
      });
      // console.log({ altSequences });
      return altSequences.reduce((acc, b) => {
        if (acc.count < b.count) {
          return acc;
        }
        return b;
      }, altSequences[0]);
    }
  );

  console.log({
    controlSequences: controlSequences
      .flatMap((c) => c.queue.flatMap((q, i) => new Array(q).fill(nodes[i])))
      .join("")
      .split("A")
      .slice(0, -1)
      .sort()
      .join("A"),
  });
  console.log({
    control: controlSequences.map((c) => c.count),
    control2: controlSequences.map((c) => c.queue.length),
  });
  return controlSequences.reduce((a, b) => a + b.count, 0);
}

function getAllSequences(input, positions) {
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
    // console.log({ start, target, to: input[i], allMovements });
    sequences.push(allMovements);
    start = target;
  }
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

  if (movementsX.length == 0) {
    return [movementsY];
  }
  if (movementsY.length == 0) {
    return [movementsX];
  }

  return [movementsX.concat(movementsY), movementsY.concat(movementsX)];
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
