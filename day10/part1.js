const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split("").map(Number));
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
//-----------

console.log(routeFinder());

//-----------

function routeFinder(map = parseInput()) {
  const cleanMap = new Array(map.length)
    .fill(0)
    .map(() => new Array(map[0].length).fill(0));

  let count = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 0) {
        count += countPeaks(structuredClone(cleanMap), map, i, j);
      }
    }
  }
  return count;
}

function countPeaks(cleanMap, map, i, j, id = i * map[0].length + j) {
  // console.log("fresh", { i, j });
  let locations = [[i, j]];

  for (let i = 0; i < 9; i++) {
    // console.log({ locations });
    let newLocations = [];
    for (let [i, j] of locations) {
      for (let [di, dj] of directions) {
        const [ni, nj] = [i + di, j + dj];
        if (withinBoundaries(map, ni, nj)) {
          if (map[ni][nj] - map[i][j] == 1 && !cleanMap[ni][nj]) {
            newLocations.push([ni, nj]);
            // cleanMap[ni][nj] = 1;
          }
        }
      }
    }
    locations = newLocations;
  }

  // console.log("final", { locations });

  return locations.length;
}

function withinBoundaries(map, i, j) {
  return i >= 0 && i < map.length && j >= 0 && j < map[0].length;
}
