const fs = require("fs");
function parseInput() {
  let [map, dirs] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  dirs = dirs.split("").filter((c) => c != "\n");
  map = map.split("\n").map((line) => line.split(""));
  return { map, dirs };
}

const directions = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};

//-----------

console.log(solve());

//-----------

function solve({ map, dirs } = parseInput()) {
  map = applyMoves({ map, dirs });
  return calcScore(map);
}

function findRobot(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == "@") {
        return [i, j];
      }
    }
  }
}

function applyMoves({ map, dirs }) {
  let [ri, rj] = findRobot(map);
  for (let dir of dirs) {
    let [di, dj] = directions[dir];

    let [ni, nj] = [ri + di, rj + dj];
    if (map[ni][nj] == ".") {
      map[ni][nj] = "@";
      map[ri][rj] = ".";
      [ri, rj] = [ni, nj];
      continue;
    }
    while (map[ni][nj] != "." && map[ni][nj] != "#") {
      [ni, nj] = [ni + di, nj + dj];
    }
    if (map[ni][nj] == ".") {
      map[ni][nj] = "O";
      map[ri][rj] = ".";
      map[ri + di][rj + dj] = "@";
      [ri, rj] = [ri + di, rj + dj];
    }
  }
  return map;
}

function printMap(map) {
  return map.map((line) => line.join("")).join("\n");
}

function calcScore(map) {
  let sum = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == "O") {
        sum += i * 100 + j;
      }
    }
  }
  return sum;
}
// function withinBounds(map, i, j) {
//   return i >= 0 && i < map.length && j >= 0 && j < map[0].length;
// }
