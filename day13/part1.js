const fs = require("fs");
const { argv } = require("process");
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
      return { Ax, Ay, Bx, By, Px, Py };
    });
}

//-----------

console.log(calc());

//-----------

function calc(games = parseInput()) {
  return games
    .map((game) => {
      let min = Infinity;
      for (let acount = 0; acount < 100; acount++) {
        for (let bcount = 0; bcount < 100; bcount++) {
          if (
            game.Ax * acount + game.Bx * bcount === game.Px &&
            game.Ay * acount + game.By * bcount === game.Py
          ) {
            min = Math.min(min, acount * 3 + bcount);
          }
        }
      }
      return min === Infinity ? 0 : min;
    })
    .reduce((a, b) => a + b);
}
