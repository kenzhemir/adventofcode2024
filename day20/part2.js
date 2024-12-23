const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => line.split(""));
}

let SAVE = 100;

let CHEAT_LENGTH = 20;

let directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];
const map = [];
//-----------

console.log(solve());

//-----------

function solve(input = parseInput()) {
  let [si, sj] = findSymbol(input, "S");
  let [ei, ej] = findSymbol(input, "E");
  const length = pathfind(input, si, sj, ei, ej);

  // console.log(
  //   input
  //     .map((line) => line.map((item) => String(item).padStart(3, " ")).join(""))
  //     .join("\n")
  // );
  console.log({ length });

  return trycheats(input, si, sj, ei, ej);
}

function findSymbol(input, symbol) {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === symbol) {
        return [i, j];
      }
    }
  }
}

function pathfind(input, si, sj, ei, ej) {
  input[si][sj] = 0;
  map.push([si, sj]);
  let index = 1;

  while (si != ei || sj != ej) {
    let [di, dj] = directions.find(([di, dj]) =>
      [".", "E"].includes(input[si + di][sj + dj])
    );

    let [ni, nj] = [si + di, sj + dj];
    map.push([ni, nj]);
    input[ni][nj] = index++;
    [si, sj] = [ni, nj];
  }
  return map.length;
}

function trycheats(input) {
  let count = 0;
  for (let i = 0; i < map.length - 1; i++) {
    for (let j = i + 1; j < map.length; j++) {
      let [si, sj] = map[i];
      let [ei, ej] = map[j];
      let cl = manhattanDistance([si, sj], [ei, ej]);
      if (cl <= CHEAT_LENGTH) {
        let saved = parseInt(input[ei][ej]) - parseInt(input[si][sj]) - cl;
        if (saved >= SAVE) {
          count++;
        }
      }
    }
  }
  return count;
}

function manhattanDistance([si, sj], [ei, ej]) {
  return Math.abs(si - ei) + Math.abs(sj - ej);
}

function withinBounds(input, i, j) {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
}
