const fs = require("fs");
function parseInput() {
  let [map, dirs] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  map = map
    .replaceAll("#", "##")
    .replaceAll("O", "[]")
    .replaceAll(".", "..")
    .replaceAll("@", "@.");
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
let shouldLog = false;
let log = shouldLog ? console.log : () => {};

//-----------

console.log(solve());

//-----------

function solve({ map, dirs } = parseInput()) {
  const origStats = getStats(map);
  map = applyMoves({ map, dirs, origStats });
  console.log(printableMap(map));
  return calcScore(map);
}

function getStats(map) {
  let walls = 0;
  let boxes = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == "[") {
        if (map[i][j + 1] != "]") {
          console.log(printableMap(map), i, j);
          throw new Error("Invalid box");
        }
        boxes++;
      }
      if (map[i][j] == "#") {
        walls++;
      }
      if (map[i][j] == "]" && map[i][j - 1] != "[") {
        console.log(printableMap(map), i, j);
        throw new Error("Invalid box");
      }
    }
  }
  return { walls, boxes };
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

function applyMoves({ map, dirs, origStats }) {
  let [ri, rj] = findRobot(map);

  let count = 0;
  log("Initial state");
  log(printableMap(map));
  for (let dir of dirs) {
    count++;
    // if (count > 60) log = console.log;
    log("Move " + dir, ", count: ", count);
    let [di, dj] = directions[dir];
    let [ni, nj] = [ri + di, rj + dj];
    let moved = false;
    if (map[ni][nj] == ".") {
      log({ ni, nj, ri, rj });
      map[ni][nj] = "@";
      map[ri][rj] = ".";
      moved = true;
    } else {
      if (dir == "^" || dir == "v") {
        moved = verticalShift(map, ri, rj, di, dj);
      } else {
        moved = horizontalShift(map, ri, rj, di, dj);
      }
    }
    if (moved) {
      [ri, rj] = [ni, nj];
    }

    log("Move " + dir);
    log(printableMap(map));
    if (JSON.stringify(getStats(map)) != JSON.stringify(origStats)) {
      console.log("Invalid state");
      console.log(printableMap(map));
      throw new Error("Invalid state");
    }
  }
  return map;
}

function horizontalShift(map, ri, rj, di, dj) {
  let [ni, nj] = [ri + di, rj + dj];
  while (map[ni][nj] != "." && map[ni][nj] != "#") {
    [ni, nj] = [ni + di, nj + dj];
  }
  if (map[ni][nj] == ".") {
    for (let j = nj; j != rj; j -= dj) {
      map[ni][j] = map[ni][j - dj];
    }
    map[ri][rj] = ".";
  } else {
    return false;
  }
  return true;
}

function verticalShift(map, ri, rj, di, dj) {
  let frontline = [[ri, rj]];
  let memory = [frontline];
  let walled = false;
  let moves = 0;
  while (frontline.length && !walled) {
    log("Frontline", frontline);
    let setline = new Set();
    moves += 1;
    for (let i = 0; i < frontline.length; i++) {
      let [fi, fj] = frontline[i];
      let [ni, nj] = [fi + di, fj + dj];
      if (map[ni][nj] == "#") {
        walled = true;
        break;
      }
      if (map[ni][nj] != ".") {
        if (map[ni][nj] == "]") {
          setline.add(nj - 1);
        }
        setline.add(nj);
        if (map[ni][nj] == "[") {
          setline.add(nj + 1);
        }
      }
    }
    frontline = [...setline.values()].map((j) => [frontline[0][0] + di, j]);
    memory.push(frontline);
  }
  log(JSON.stringify({ memory }));
  if (!walled) {
    while (memory.length) {
      let frontline = memory.pop();
      for (let [fi, fj] of frontline) {
        log({ fi, fj, di, dj });
        map[fi + di][fj + dj] = map[fi][fj];
        map[fi][fj] = ".";
      }
    }
  }
  return !walled;
}

function printableMap(map) {
  return map
    .map((line) => line.join(""))
    .join("\n")
    .replaceAll("@", "\x1b[33m\x1b[42m@\x1b[0m\x1b[0m");
}

function calcScore(map) {
  let sum = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == "[") {
        sum += i * 100 + j;
      }
    }
  }
  return sum;
}
// function withinBounds(map, i, j) {
//   return i >= 0 && i < map.length && j >= 0 && j < map[0].length;
// }
