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

  let triplets = new Set();
  for (let [from, to] of links) {
    let fromConnections = connections[from];
    let toConnections = connections[to];
    for (let node of fromConnections) {
      if (toConnections.includes(node)) {
        if (
          from.startsWith("t") ||
          to.startsWith("t") ||
          node.startsWith("t")
        ) {
          triplets.add([from, to, node].sort().join(","));
        }
      }
    }
  }

  return triplets;
}
