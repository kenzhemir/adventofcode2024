const { group } = require("console");
const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((line) => line.split("-"));
}
let N = 2000;

const enableDebug = false;
const debug = enableDebug ? console.log : () => {};
//-----------

console.log(solve());

//-----------

function solve(links = parseInput()) {
  let connections = {};

  for (let [from, to] of links) {
    if (!connections[from]) connections[from] = [];
    if (!connections[to]) connections[to] = [];
    connections[from].push(to);
    connections[to].push(from);
  }

  let uniqueNodes = Object.keys(connections);

  let groupsOfN = links;
  for (let i = 2; i < 80; i++) {
    let newGroups = [];
    for (let group of groupsOfN) {
      let neighbors = connections[group[0]];
      let newCandidates = neighbors
        .filter((neighbor) => !group.includes(neighbor))
        .filter((neighbor) =>
          group.every((node) => connections[neighbor].includes(node))
        );
      newCandidates.map((newCandidate) => {
        newGroups.push([...group, newCandidate]);
      });
    }
    if (newGroups.length === 0) break;
    groupsOfN = newGroups;

    // clean
    let set = new Set();
    for (let group of groupsOfN) {
      set.add(group.sort().join(","));
    }
    groupsOfN = Array.from(set).map((group) => group.split(","));
  }

  return groupsOfN
    .map((group) => group.join(","))
    .sort()
    .join("\n");
}
