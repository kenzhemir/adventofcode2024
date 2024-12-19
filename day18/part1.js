const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => line.split(",").map(Number));
}

const size = 71;
const stepLimit = 1024;

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

Array.prototype.tap = function () {
  console.log(this);
  return this;
};
//-----------

console.log(fallingSim());

//-----------

function fallingSim(input = parseInput()) {
  const map = new Array(size).fill(0).map(() => new Array(size).fill("."));
  const dist = new Array(size)
    .fill(0)
    .map(() => new Array(size).fill(Infinity));

  for (let i = 0; i < input.length && i < stepLimit; i++) {
    let [x, y] = input[i];
    map[y][x] = "#";
  }

  dist[0][0] = 0;
  let stack = [{ loc: [0, 0], step: 0 }];

  while (stack.length) {
    let {
      loc: [x, y],
      step,
    } = stack.pop();
    if (dist[x][y] < step) continue;
    if (x === size - 1 && y === size - 1) continue;

    directions
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => withinBoundaries(nx, ny))
      .filter(([nx, ny]) => map[nx][ny] === ".")
      //   .tap()
      .filter(([nx, ny]) => dist[nx][ny] > step + 1)
      //   .tap()
      .forEach(([nx, ny]) => {
        dist[nx][ny] = step + 1;
        stack.push({ loc: [nx, ny], step: step + 1 });
      });
  }

  return dist[size - 1][size - 1];
}

function withinBoundaries(x, y) {
  return x >= 0 && x < size && y >= 0 && y < size;
}

function printMap(map) {
  console.log(map.map((row) => row.join("")).join("\n"));
}
