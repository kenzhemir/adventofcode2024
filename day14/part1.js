const fs = require("fs");
const { argv } = require("process");
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

//-----------

console.log(calc());

//-----------

function warp(v, size) {
  return ((v % size) + size) % size;
}

function calc(robots = parseInput(), steps = 100, h = 101, w = 103) {
  const hh = Math.floor(h / 2);
  const hw = Math.floor(w / 2);
  return robots
    .map((robot) => {
      return [
        warp(robot.p[0] + robot.v[0] * steps, h),
        warp(robot.p[1] + robot.v[1] * steps, w),
      ];
    })
    .tap()
    .reduce(
      (acc, pos) => {
        if (pos[0] < hh && pos[1] < hw) acc[0]++;
        if (pos[0] > hh && pos[1] < hw) acc[1]++;
        if (pos[0] < hh && pos[1] > hw) acc[2]++;
        if (pos[0] > hh && pos[1] > hw) acc[3]++;
        return acc;
      },
      [0, 0, 0, 0]
    )
    .tap()
    .reduce((acc, x) => acc * x, 1);
}

