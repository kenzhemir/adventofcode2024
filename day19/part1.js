const fs = require("fs");
function parseInput() {
  let [towels, designs] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  towels = towels.split(", ");
  designs = designs.split("\n");
  return { towels, designs };
}

//-----------

console.log(countPossiblePatterns());

//-----------

function countPossiblePatterns({ towels, designs } = parseInput()) {
  return designs
    .map((design) => isPossible(towels, design))
    .reduce((acc, curr) => acc + curr, 0);
}

function isPossible(towels, design) {
  if (design === "") return true;
  for (let towel of towels) {
    if (design.startsWith(towel)) {
      if (isPossible(towels, design.slice(towel.length))) return true;
    }
  }
  return false;
}
