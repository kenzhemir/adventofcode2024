function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

//-----------

// console.log(xMasDotmap());
console.log(xMasFinder());
// console.log(debug());
// function debug(input = parseInput()) {
//   return directionsWithBoundary(input, 9, 3, 4);
// }

//-----------

function xMasDotmap(input = parseInput()) {
  let rows = input.length;
  let cols = input[0].length;
  let dotmap = new Array(rows).fill(0).map(() => new Array(cols).fill("."));
  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[i].length - 1; j++) {
      if (input[i][j] == 'A' && confirmMS(input, i, j)) {
        dotmap[i][j] = input[i][j];
        dotmap[i-1][j-1] = input[i-1][j-1];
        dotmap[i-1][j+1] = input[i-1][j+1];
        dotmap[i+1][j-1] = input[i+1][j-1];
        dotmap[i+1][j+1] = input[i+1][j+1];
      }
    }
  }
  return dotmap.map((row) => row.join("")).join("\n");
}

function xMasFinder(input = parseInput()) {
  let count = 0;
  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[i].length - 1; j++) {
      if (input[i][j] == 'A' && confirmMS(input, i, j)) count++;
    }
  }
  return count;
}

function confirmMS(matrix, fromX, fromY) {
  const diag1 = [
    [fromX - 1, fromY - 1],
    [fromX + 1, fromY + 1],
  ];
  const diag2 = [
    [fromX - 1, fromY + 1],
    [fromX + 1, fromY - 1],
  ];
  return [diag1, diag2].every((diag) => {
    const first = matrix[diag[0][0]][diag[0][1]];
    const second = matrix[diag[1][0]][diag[1][1]];
    return [first, second].includes("M") && [first, second].includes("S");
  });
}
