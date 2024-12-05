function parseInput() {
  const fs = require("fs");
  const [firstSection, secondSection] = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");

  return [
    firstSection.split("\n").map((row) => row.split("|").map(Number)),
    secondSection.split("\n").map((row) => row.split(",").map(Number)),
  ];
}

//-----------

// console.log(xmasDotmap());
console.log(printQueue());
// console.log(debug());
// function debug(input = parseInput()) {
//   return directionsWithBoundary(input, 9, 3, 4);
// }

//-----------

function printQueue([rules, updates] = parseInput()) {
  const rulesLookup = rules.reduce((acc, [a, b]) => {
    if (!acc[a]) acc[a] = [];
    acc[a].push(b);
    return acc;
  }, {});

  let sum = 0;
  for (let update of updates) {
    if (isOkay(rulesLookup, update)) {
      let mid = update[Math.floor(update.length / 2)];
      // console.log(mid);
      sum += mid;
    }
  }

  return sum;
}

function isOkay(rulesLookup, update, size = update.length - 1) {
  // console.log({update, size});
  if (size == 0) {
    return true;
  }
  let everythingFineExceptLast = isOkay(rulesLookup, update, size - 1);
  if (!everythingFineExceptLast) {
    return false;
  }
  let last = update[size];
  let allAheaders = rulesLookup[last];

  if (!allAheaders) {
    return true;
  }
  for (let i = 0; i < size; i++) {
    if (allAheaders.includes(update[i])) {
      return false;
    }
  }

  return true;
}
