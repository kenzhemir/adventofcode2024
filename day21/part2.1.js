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

const controlMap = buildControlSeq(controlPositions);
const codeMap = buildControlSeq(codePositions);

function invertPositions(positions) {
  return Object.entries(positions).reduce((acc, [key, [row, col]]) => {
    if (!acc[row]) {
      acc[row] = {};
    }
    acc[row][col] = key;
    return acc;
  }, {});
}

const inverseControlMap = invertPositions(controlPositions);
const inverseCodeMap = invertPositions(codePositions);
let DEPTH = Number(process.argv[2]);

//-----------

console.log(solve());

//-----------

function solve(input = parseInput()) {
  let sum = 0;
  for (let code of input) {
    let codeSequenceOptions = inputFor(code, 0, codePositions, codeMap);
    console.log(codeSequenceOptions);
    let len_of_control = Math.min(
      ...codeSequenceOptions.map((seq) => shortestSequence(seq, DEPTH, {}))
    );
    console.log({ code, len_of_control });
    sum += len_of_control * parseInt(code);
  }

  return sum;
}

function shortestSequence(code, depth, cache) {
  if (depth == 0) {
    return code.length;
  }
  if (cache[code + depth] !== undefined) {
    return cache[code + depth];
  }
  let totalLength = 0;
  for (let subcode of code
    .split("A")
    .slice(0, -1)
    .map((c) => c + "A")) {
    let options = inputFor(subcode);
    let min = Infinity;
    for (let option of options) {
      let len = shortestSequence(option, depth - 1, cache);
      min = Math.min(min, len);
    }
    totalLength += min;
  }
  cache[code + depth] = totalLength;
  return totalLength;
}

function inputFor(code, index = 0, positions = controlPositions, map = controlMap) {
  if (index == code.length) {
    return [""];
  }
  let prev = index ? code[index - 1] : "A";
  let curr = code[index];
  let options = map[prev][curr];
  let future = inputFor(code, index + 1, positions, map);

  return options.flatMap((option) => {
    return future.map((f) => option + "A" + f);
  });
}

function output(sequence, positions) {
  let output = "";
  let curr = "A";
  for (let i = 0; i < sequence.length; i++) {
    let move = sequence[i];
    let [cx, cy] = positions[curr];
    if (move == "A") {
      output += curr;
      continue;
    }
    let [dx, dy] = moves[move];
    let [nx, ny] = [cx + dx, cy + dy];
    curr = inverseControlMap[nx][ny];
  }
  return output;
}

function buildControlSeq(positions) {
  let keys = Object.keys(positions).filter((key) => key !== "skip");

  let mapFromTo = Object.fromEntries(
    keys.map((from) => [
      from,
      Object.fromEntries(
        keys.map((to) => {
          return [
            to,
            getAllManhattanMovements(
              positions[from],
              positions[to],
              positions["skip"]
            ),
          ];
        })
      ),
    ])
  );

  return mapFromTo;
}

function getAllManhattanMovements([row1, col1], [row2, col2], [rowS, colS]) {
  let movementsX = "";
  let movementsY = "";
  let diffRow = row2 - row1;
  let diffCol = col2 - col1;
  if (diffCol > 0) {
    movementsX = ">".repeat(diffCol);
  } else {
    movementsX = "<".repeat(-diffCol);
  }
  if (diffRow < 0) {
    movementsY = "^".repeat(-diffRow);
  } else {
    movementsY = "v".repeat(diffRow);
  }

  if (rowS == row1 && colS == col2) {
    return [movementsY + movementsX];
  }
  if (rowS == row2 && colS == col1) {
    return [movementsX + movementsY];
  }

  if (movementsX.length == 0) {
    return [movementsY];
  }
  if (movementsY.length == 0) {
    return [movementsX];
  }

  return [movementsX + movementsY, movementsY + movementsX];
}
