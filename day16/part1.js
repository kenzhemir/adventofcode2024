const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => line.split(""));
}

const directs = {
  "^": [-1, 0],
  S: [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

//-----------

console.log(solve());

//-----------

function findSymbol(maze, symbol) {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] == symbol) return [i, j];
    }
  }
}

function solve(maze = parseInput()) {
  let [si, sj] = findSymbol(maze, "S");
  let [ei, ej] = findSymbol(maze, "E");

  let scores = new Array(maze.length)
    .fill(0)
    .map(() =>
      new Array(maze[0].length).fill(0).map(() => new Array(4).fill(Infinity))
    );

  let allSet = new Set();

  let stack = [[si, sj, 0, 0, 0, new Set()]];
  function assignScores(i, j, dir, score) {
    let improvedDirs = [];
    if (score <= scores[i][j][dir]) {
      scores[i][j][dir] = score;
      improvedDirs.push(dir);
    }
    if (score + 1000 <= scores[i][j][(dir + 1) % 4]) {
      scores[i][j][(dir + 1) % 4] = score + 1000;
      improvedDirs.push((dir + 1) % 4);
    }
    if (score + 2000 <= scores[i][j][(dir + 2) % 4]) {
      scores[i][j][(dir + 2) % 4] = score + 2000;
      improvedDirs.push((dir + 2) % 4);
    }
    if (score + 1000 <= scores[i][j][(dir + 3) % 4]) {
      scores[i][j][(dir + 3) % 4] = score + 1000;
      improvedDirs.push((dir + 3) % 4);
    }
    return improvedDirs;
  }

  while (stack.length) {
    let [i, j, dir, score, steps, set] = stack.pop();
    set.add(i + "," + j);
    if (score > 143580) continue;
    if (ei == i && ej == j) {
      console.log(score);
      if (score == 143580) {
        console.log({ steps });
      }
      set.forEach((s) => allSet.add(s));
    }
    let improvedDirs = assignScores(i, j, dir, score);
    // console.log({ i, j, dir, score, improvedDirs });

    for (let d of improvedDirs) {
      let [di, dj] = directions[d];
      let prevScore = scores[i][j][d];
      let [ni, nj] = [i + di, j + dj];
      if (withinBounds(maze, ni, nj) && maze[ni][nj] != "#") {
        let newSet = new Set(set);
        stack.push([ni, nj, d, prevScore + 1, steps + 1, newSet]);
      }
    }
  }

  return allSet.size;
}

function withinBounds(map, i, j) {
  return i >= 0 && j >= 0 && i < map.length && j < map[0].length;
}
