const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

let LOOP_LIMIT = 100_000_000;
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

console.log(findObstacles());

//-----------
function findObstacles(field = parseInput()) {
  let locations = traceGuard(structuredClone(field));
  let [gi, gj] = findGuard(field);
  locations = locations.filter(([x, y]) => x != gi || y != gj);
  let cycle = 0;
  for (let i = 0; i < locations.length; i++) {
    let [ni, nj] = locations[i];

    // block
    field[ni][nj] = "#";

    const isLoop = loopDetection(structuredClone(field), [gi, gj]);
    if (isLoop) {
      // field[ni][nj] = "O";
      // console.log("WINNER SPOT");
      // prettyPrint(field);
      cycle++;
    }

    field[ni][nj] = ".";
  }
  return cycle;
}

function loopDetection(field, [gi, gj]) {
  let out = false;
  let cycle = false;
  let loop1 = 0;
  while (!out && !cycle && loop1++ < LOOP_LIMIT) {
    [out, field, [gi, gj], cycle] = guardStepTrail(field, [gi, gj]);
  }
  if (loop1 >= LOOP_LIMIT) {
    throw new Error("cycle Loop limit reached");
  }
  return cycle;
}

function guardStepTrail(field, [gi, gj]) {
  let guard = field[gi][gj];
  let currStepNum = 0;
  if (guard.includes(",")) {
    [guard, currStepNum] = guard.split(",");
    currStepNum = Number(currStepNum);
  }
  const [dx, dy] = directions[guard];
  const [ni, nj] = [gi + dx, gj + dy];

  if (outsideBoundary(field, [ni, nj])) {
    return [true, field, [gi, gj], false];
  }
  if (field[ni][nj] === "#") {
    field[gi][gj] = turn[guard];
    return [false, field, [gi, gj], false];
  }
  if (field[ni][nj] === ".") {
    field[gi][gj] = String(currStepNum + 1);
    field[ni][nj] = guard;
    return [false, field, [ni, nj], false];
  }
  if (field[ni][nj] === "5") {
    return [false, field, [ni, nj], true];
  }
  if (Number.isInteger(Number(field[ni][nj]))) {
    field[gi][gj] = String(currStepNum + 1);
    field[ni][nj] = guard + "," + field[ni][nj];
    return [false, field, [ni, nj], false];
  }

  throw new Error("unexpected");
}

function prettyPrint(field) {
  console.log(field.map((row) => row.join("")).join("\n"));
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

function traceGuard(field = parseInput()) {
  let [gi, gj] = findGuard(field);

  let out = false;
  let locations = [];
  while (!out) {
    [out, field, [gi, gj], newStep] = traceStep(field, [gi, gj]);
    if (newStep) {
      locations.push(newStep);
    }
  }
  return locations;
}

function traceStep(field, [gi, gj]) {
  const guard = field[gi][gj];
  const [dx, dy] = directions[guard];
  const [ni, nj] = [gi + dx, gj + dy];

  if (outsideBoundary(field, [ni, nj])) {
    return [true, field, [gi, gj]];
  }
  if (field[ni][nj] === "#") {
    field[gi][gj] = turn[guard];
    return [false, field, [gi, gj]];
  }
  if (field[ni][nj] === ".") {
    field[gi][gj] = "X";
    field[ni][nj] = guard;
    return [false, field, [ni, nj], [ni, nj]];
  }
  if (field[ni][nj] === "X") {
    field[gi][gj] = "X";
    field[ni][nj] = guard;
    return [false, field, [ni, nj]];
  }
  throw new Error("unexpected");
}
