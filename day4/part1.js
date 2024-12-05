function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

//-----------

// console.log(xmasDotmap());
console.log(xmasFinder());
// console.log(debug());
// function debug(input = parseInput()) {
//   return directionsWithBoundary(input, 9, 3, 4);
// }

//-----------

function xmasDotmap(input = parseInput()) {
  let rows = input.length;
  let cols = input[0].length;
  let dotmap = new Array(rows).fill(0).map(() => new Array(cols).fill("."));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let directions = findDirectionsWithWord(input, "XMAS", i, j);
      directions.forEach(([toX, toY]) => {
        "XMAS".split("").forEach((letter, stepSize) => {
          dotmap[step(i, toX, stepSize)][step(j, toY, stepSize)] = letter;
        });
      });
    }
  }
  return dotmap.map((row) => row.join("")).join("\n");
}

function xmasFinder(input = parseInput()) {
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      count += findDirectionsWithWord(input, "XMAS", i, j).length;
    }
  }
  return count;
}

function directionsWithBoundary(matrix, x, y, dist) {
  dist = dist - 1; // current x y is inclusive
  const maxX = matrix.length - 1;
  const maxY = matrix[0].length - 1;

  return [
    [x - dist, y - dist],
    [x - dist, y],
    [x - dist, y + dist],
    [x, y - dist],
    [x, y + dist],
    [x + dist, y - dist],
    [x + dist, y],
    [x + dist, y + dist],
  ].filter(
    (coords) =>
      coords[0] >= 0 && coords[0] <= maxX && coords[1] >= 0 && coords[1] <= maxY
  );
}

function findDirectionsWithWord(matrix, word, fromX, fromY) {
  const directions = directionsWithBoundary(matrix, fromX, fromY, word.length);
  const directionsWithWord = directions.filter(([toX, toY]) => {
    for (let i = 0; i < word.length; i++) {
      if (word[i] != matrix[step(fromX, toX, i)][step(fromY, toY, i)]) {
        return false;
      }
    }
    return true;
  });
  return directionsWithWord;
}

function step(from, to, size) {
  if (from == to) return from;
  if (from < to) return from + size;
  if (from > to) return from - size;
}
