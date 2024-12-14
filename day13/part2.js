const fs = require("fs");
const { argv, debugPort } = require("process");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n")
    .map((game) => {
      let [A, B, prize] = game.split("\n");
      let [Ax, Ay] = A.split(": ")[1]
        .split(", ")
        .map((x) => x.split("+")[1])
        .map(Number);
      let [Bx, By] = B.split(": ")[1]
        .split(", ")
        .map((x) => x.split("+")[1])
        .map(Number);
      let [Px, Py] = prize
        .split(": ")[1]
        .split(", ")
        .map((x) => x.split("=")[1])
        .map(Number);
      return {
        Ax,
        Ay,
        Bx,
        By,
        Px: Px,
        Py: Py,
      };
    });
}

//-----------

console.log(calc());

//-----------

function calcB(game) {
  const { Ax, Ay, Bx, By, Px, Py } = game;
  let top = Py * Ax - Ay * Px;
  let bottom = Ax * By - Bx * Ay;
  if (top % bottom !== 0) {
    return NaN;
  }
  let b = top / bottom;
  return b;
}

function calcA(game) {
  const { Ax, Ay, Bx, By, Px, Py } = game;
  let top = Py * Bx - By * Px;
  let bottom = Bx * Ay - Ax * By;
  if (top % bottom !== 0) {
    return NaN;
  }
  let a = top / bottom;
  return a;
}

function calc(games = parseInput()) {
  return games
    .map((game) => {
      let a = calcA(game);
      let b = calcB(game);
      console.log({ a, b });
      if (Number.isInteger(a) && Number.isInteger(b)) {
        return a * 3 + b;
      }
      return 0;
    })
    .reduce((a, b) => a + b);
}