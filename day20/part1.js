const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => line.split(""));
}

let SAVE = 100;

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

function trycheats(input, si, sj, ei, ej) {
  let index = 1;
  let count = 0;
  while (si != ei || sj != ej) {
    for (let [di, dj] of directions) {
      let [wi, wj] = [si + di, sj + dj];
      let [ni, nj] = [wi + di, wj + dj];

      if (
        input[wi][wj] == "#" &&
        withinBounds(input, ni, nj) &&
        input[ni][nj] != "#"
      ) {
        if (parseInt(input[ni][nj]) - parseInt(input[si][sj]) - 2 >= SAVE) {
          count++;
        }
      }
    }

    for (let [di, dj] of directions) {
      let [wi, wj] = [si + di, sj + dj];
      if (input[wi][wj] == index) {
        [si, sj] = [wi, wj];
        index++;
        break;
      }
    }
  }
  return count;
}

function withinBounds(input, i, j) {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
}
