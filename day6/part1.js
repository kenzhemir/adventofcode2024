function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

const directions = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};
const turn = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

//-----------

console.log(traceGuard());

//-----------

function traceGuard(field = parseInput()) {
  let [gi, gj] = findGuard(field);

  let out = false;
  let steps = 1;
  while (!out) {
    [out, field, [gi, gj], newStep] = guardStep(field, [gi, gj]);
    steps += newStep;
  }
  return steps;
}

function guardStep(field, [gi, gj]) {
  const guard = field[gi][gj];
  const [dx, dy] = directions[guard];
  const [ni, nj] = [gi + dx, gj + dy];

  if (outsideBoundary(field, [ni, nj])) {
    return [true, field, [gi, gj], 0];
  }
  if (field[ni][nj] === "#") {
    field[gi][gj] = turn[guard];
    return [false, field, [gi, gj], 0];
  }
  if (field[ni][nj] === ".") {
    field[gi][gj] = "X";
    field[ni][nj] = guard;
    return [false, field, [ni, nj], 1];
  }
  if (field[ni][nj] === "X") {
    field[gi][gj] = "X";
    field[ni][nj] = guard;
    return [false, field, [ni, nj], 0];
  }
}

function outsideBoundary(field, [i, j]) {
  return i < 0 || i >= field.length || j < 0 || j >= field[0].length;
}

function findGuard(field) {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === "^") {
        return [i, j];
      }
    }
  }
}

// function betterStepGuard(field = parseInput()) {
//   let rowObstacles = field.map((row) =>
//     row.reduce((acc, el, i) => {
//       if (el === "#") {
//         acc.push(i);
//       }
//       return acc;
//     }, [])
//   );
//   let colObstacles = field[0].map((_, j) =>
//     field.reduce((acc, row, i) => {
//       if (row[j] === "#") {
//         acc.push(i);
//       }
//       return acc;
//     }, [])
//   );

//   let [gi, gj] = findGuard(field, { rowObstacles, colObstacles });
// }

// function rayStep(field, [gi, gj], { rowObstacles, colObstacles }) {
//   let guard = field[gi][gj];
//   let stopper;
//   switch (guard) {
//     case "^":
//       stopper = firstDecreasing(colObstacles, gj);

//       field[gi][stopper+1] = turn[guard];

//       break;
//     case "v":
//       stopper = firstIncreasing(colObstacles, gj);
//     case ">":
//       stopper = firstIncreasing(rowObstacles, gi);
//     case "<":
//       stopper = firstDecreasing(rowObstacles, gi);
//   }

// }

// function firstIncreasing(array, x) {
//   for (let i = 0; i < array.length; i++) {
//     if (x < array[i]) {
//       return array[i];
//     }
//   }
//   return Infinity;
// }

// function firstDecreasing(array, x) {
//   for (let i = array.length - 1; i >= 0; i--) {
//     if (x > array[i]) {
//       return array[i];
//     }
//   }
//   return -1;
// }
