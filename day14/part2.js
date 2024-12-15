const fs = require("fs");
const fsPromises = require("fs/promises");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => {
      const [p, v] = line
        .split(" ")
        .map((x) => x.split("=")[1].split(",").map(Number));
      return { p, v };
    });
}
Array.prototype.tap = function () {
  console.log(this);
  return this;
};

let H = 103;
let W = 101;

//-----------

// console.log(findTree());
// console.log(drawTree());
console.log(calcTree());

//-----------

function warp(v, size) {
  return ((v % size) + size) % size;
}

function step(robots, steps = 1, h = H, w = W) {
  return robots.map((robot) => {
    const np = [
      warp(robot.p[0] + robot.v[0] * steps, w),
      warp(robot.p[1] + robot.v[1] * steps, h),
    ];
    return { p: np, v: robot.v };
  });
}

function makeGrid(robots, h = H, w = W) {
  const grid = Array(h)
    .fill(0)
    .map(() => Array(w).fill(0));
  robots.forEach((robot) => {
    grid[robot.p[1]][robot.p[0]] = 1;
  });
  return grid;
}

function draw(grid) {
  return grid
    .map((row) => row.map((cell) => (cell === 1 ? "1" : ".")).join(""))
    .join("\n");
}

function findTree(input = parseInput()) {
  let steps = 0;
  const groups = [];
  while (steps < 10_000) {
    steps++;
    input = step(input);
    const pic = makeGrid(input);
    const maxGroup = detectMaxGroup(pic);
    groups.push([maxGroup, steps]);
  }

  groups.sort((a, b) => b[0] - a[0]);
  return groups.slice(0, 10);
}

function drawTree(input = parseInput()) {
  const robots = step(input, process.argv[2]);
  const pic = makeGrid(robots);
  return draw(pic);
}

function calcTree(input = parseInput(), h = H, w = W) {
  const hh = Math.floor(h / 2);
  const hw = Math.floor(w / 2);
  const robots = step(input, process.argv[2]);

  const pic = makeGrid(robots);
  console.log(draw(pic));
  return robots
    .reduce(
      (acc, robot) => {
        if (robot.p[0] < hw && robot.p[1] < hh) acc[0]++;
        if (robot.p[0] > hw && robot.p[1] < hh) acc[1]++;
        if (robot.p[0] < hw && robot.p[1] > hh) acc[2]++;
        if (robot.p[0] > hw && robot.p[1] > hh) acc[3]++;
        return acc;
      },
      [0, 0, 0, 0]
    )
    .reduce((acc, x) => acc * x, 1);
}

function detectMaxGroup(pic) {
  const visited = Array(pic.length)
    .fill(0)
    .map(() => Array(pic[0].length).fill(false));
  let maxGroup = 0;
  for (let y = 0; y < pic.length; y++) {
    for (let x = 0; x < pic[y].length; x++) {
      if (pic[y][x] === 1 && !visited[y][x]) {
        const group = detectGroup(pic, visited, x, y);
        if (group > maxGroup) maxGroup = group;
      }
    }
  }
  return maxGroup;
}

function detectGroup(pic, visited, x, y) {
  if (x < 0 || y < 0 || x >= pic[0].length || y >= pic.length) return 0;
  if (visited[y][x] || pic[y][x] === 0) return 0;
  visited[y][x] = true;
  return (
    1 +
    detectGroup(pic, visited, x + 1, y) +
    detectGroup(pic, visited, x - 1, y) +
    detectGroup(pic, visited, x, y + 1) +
    detectGroup(pic, visited, x, y - 1) +
    detectGroup(pic, visited, x + 1, y + 1) +
    detectGroup(pic, visited, x - 1, y - 1) +
    detectGroup(pic, visited, x + 1, y - 1) +
    detectGroup(pic, visited, x - 1, y + 1)
  );
}
