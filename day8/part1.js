function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

//-----------

console.log(countAntenodes());

//-----------

function countAntenodes(field = parseInput()) {
  let nodesField = new Array(field.length)
    .fill(0)
    .map(() => new Array(field[0].length).fill("."));

  let groups = {};
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] !== ".") {
        if (!groups[field[i][j]]) {
          groups[field[i][j]] = [];
        }
        groups[field[i][j]].push([i, j]);
      }
    }
  }

  console.log(groups);

  for (let antenna in groups) {
    let group = groups[antenna];
    markAntenodes(nodesField, group);
  }
  prettyPrint(nodesField);
  return count(nodesField);
}

function prettyPrint(field) {
  console.log(field.map((row) => row.join("")).join("\n"));
}

function count(field) {
  let count = 0;
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      if (field[i][j] === "#") {
        count++;
      }
    }
  }
  return count;
}

function markAntenodes(field, group) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const [ai, aj] = group[i];
      const [bi, bj] = group[j];

      let dir = [bi - ai, bj - aj];
      let one = [bi + dir[0], bj + dir[1]];
      let two = [ai - dir[0], aj - dir[1]];
      if (withinBoundary(field, one)) {
        field[one[0]][one[1]] = "#";
      }
      if (withinBoundary(field, two)) {
        field[two[0]][two[1]] = "#";
      }

      // console.log({ a: group[i], b: group[j], one, two });
    }
  }
}

function withinBoundary(field, [i, j]) {
  return i >= 0 && i < field.length && j >= 0 && j < field[i].length;
}
