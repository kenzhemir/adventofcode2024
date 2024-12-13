const fs = require("fs");
const { argv } = require("process");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((x) => x.split(""));
}

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];
//-----------

console.log(bfs());

//-----------

function bfs(input = parseInput()) {
  let visited = new Array(input.length)
    .fill(0)
    .map(() => new Array(input[0].length).fill(0));

  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (!visited[i][j]) {
        sum += visitGroup(input, visited, i, j);
      }
    }
  }
  return sum
}

function visitGroup(input, visited, i, j) {
  let stack = [[i, j]];
  let groupSize = 0;
  let groupPerimeter = 0;
  let groupName = input[i][j];
  while (stack.length) {
    let [x, y] = stack.pop();
    if (visited[x][y]) continue;
    visited[x][y] = 1;
    groupSize++;
    let neighbours = directions.map(([dx, dy]) => [x + dx, y + dy]);
    groupPerimeter += neighbours
      .map(([x, y]) => {
        if (!withinBounds(input, x, y)) return 1;
        if (input[x][y] === groupName) {
          stack.push([x, y]);
          return 0;
        } else {
          return 1;
        }
      })
      .reduce((acc, curr) => acc + curr, 0);
  }
  return groupSize * groupPerimeter;
}

function withinBounds(input, x, y) {
  return x >= 0 && y >= 0 && x < input.length && y < input[0].length;
}
