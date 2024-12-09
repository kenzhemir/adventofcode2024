function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => row.split(""));
}

let once = 1;
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

  // console.log(groups);

  for (let antenna in groups) {
    let group = groups[antenna];
    markAntenodes(nodesField, group);
  }
  // console.log("end");
  // let print = structuredClone(nodesField);
  // for (let antenna in groups) {
  //   let group = groups[antenna];
  //   group.forEach(([i, j]) => {
  //     print[i][j] = antenna;
  //   });
  // }
  // prettyPrint(print);
  // console.log("antennas");
  // prettyPrint(nodesField);
  return countN(nodesField);
}

function prettyPrint(field) {
  console.log(field.map((row) => row.join("")).join("\n"));
}

function countN(field) {
  return field.reduce((acc, row) => {
    acc += row.filter((cell) => cell === "#").length;
    return acc;
  }, 0);
}

function markAntenodes(field, group) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const [ai, aj] = group[i];
      const [bi, bj] = group[j];
      let dir = [bi - ai, bj - aj];

      let one = [bi, bj];
      while (withinBoundary(field, one)) {
        field[one[0]][one[1]] = "#";
        one = [one[0] + dir[0], one[1] + dir[1]];
      }
      let two = [ai, aj];
      while (withinBoundary(field, two)) {
        field[two[0]][two[1]] = "#";
        two = [two[0] - dir[0], two[1] - dir[1]];
      }
      // console.log({ a: group[i], b: group[j], one, two });
      // const print = structuredClone(field);
      // print[ai][aj] = "A";
      // print[bi][bj] = "B";
      // prettyPrint(print);
    }
  }
}

function withinBoundary(field, [i, j]) {
  return i >= 0 && i < field.length && j >= 0 && j < field[i].length;
}
