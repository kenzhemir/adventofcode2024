function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => line.split(" ").map((num) => parseInt(num)));
}

console.log(part2());

console.log(
  part2([
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
    [4, 5, 3, 2, 1]
  ]) == 4
);

function part2(input = parseInput()) {
  let count = 0;
  for (let row of input) {
    if (count < 2) {
      console.log(row);
    }
    if (isIncreasing(row) || isIncreasing(row.reverse())) {
      count++;
    }
  }
  return count;
}

function isIncreasing(row) {
  let diffs = [];
  for (let i = 0; i < row.length - 1; i++) {
    diffs.push(row[i + 1] - row[i]);
  }

  let stitches = 1;
  for (let i = 0; i < diffs.length; i++) {
    if (diffs[i] > 0 && diffs[i] <= 3) {
      continue;
    }
    if (stitches == 0) {
      return false;
    }
    const canStitchBackward = i == 0 || withinRange(row[i - 1], row[i + 1]);
    const canStitchForward =
      i + 2 >= row.length || withinRange(row[i], row[i + 2]);

    if (canStitchForward) {
      diffs[i + 1] = 1;
      stitches--;
      continue;
    }

    if (canStitchBackward) {
      stitches--;
      continue;
    }
    return false;
  }
  return true;
}

function withinRange(a, b) {
  return b - a > 0 && b - a <= 3;
}
