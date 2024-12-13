const { group } = require("console");
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
  return sum;
}

function visitGroup(input, visited, i, j) {
  let perimeters = [[], [], [], []];
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
    neighbours.forEach(([nx, ny], i) => {
      if (withinBounds(input, nx, ny) && input[nx][ny] === groupName) {
        stack.push([nx, ny]);
      } else {
        perimeters[i].push([nx, ny]);
      }
    });
  }

  perimeters.slice(0, 2).forEach((vertical_perim) => {
    let rp = 0;
    const group_by_cols = vertical_perim.reduce((acc, [x, y]) => {
      if (!acc[y]) acc[y] = [];
      acc[y].push(x);
      return acc;
    }, {});
    for (let col of Object.values(group_by_cols)) {
      col.sort((a, b) => a - b);
      for (let i = 0; i < col.length; i++) {
        // console.log({ i, colBefore: col[i - 1], colNow: col[i] });
        if (col[i - 1] != col[i] - 1) rp++;
      }
    }

    if (groupName == "C") console.log({ groupName, group_by_cols, rp });
    groupPerimeter += rp;
  });
  perimeters.slice(2).forEach((horizontal) => {
    let rp = 0;
    const group_by_rows = horizontal.reduce((acc, [y, x]) => {
      if (!acc[y]) acc[y] = [];
      acc[y].push(x);
      return acc;
    }, {});
    for (let row of Object.values(group_by_rows)) {
      row.sort((a, b) => a - b);
      for (let i = 0; i < row.length; i++) {
        if (groupName == "C")
          console.log({ rp, i, colBefore: row[i - 1], colNow: row[i] });
        if (row[i - 1] != row[i] - 1) rp++;
      }
    }
    if (groupName == "C") console.log({ groupName, group_by_rows, rp });

    groupPerimeter += rp;
  });

  console.log({ region: groupName, price: groupSize * groupPerimeter });

  return groupSize * groupPerimeter;
}

function withinBounds(input, x, y) {
  return x >= 0 && y >= 0 && x < input.length && y < input[0].length;
}
