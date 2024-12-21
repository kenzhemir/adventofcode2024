const fs = require("fs");
function parseInput() {
  let [towels, designs] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  towels = towels.split(", ");
  designs = designs.split("\n");
  return { towels, designs };
}

const designmemo = {};

//-----------

console.log(countPossiblePatterns());

//-----------

function countPossiblePatterns({ towels, designs } = parseInput()) {
  return designs
    .map((design) => countPossibleArrangements(towels, design))
    .reduce((acc, curr) => acc + curr, 0);
}

function countPossibleArrangements(towels, design) {
  if (design in designmemo) return designmemo[design];
  if (design === "") return 1;
  let count = 0;
  for (let towel of towels) {
    if (design.startsWith(towel)) {
      count += countPossibleArrangements(towels, design.slice(towel.length));
    }
  }
  designmemo[design] = count;
  return count;
}
