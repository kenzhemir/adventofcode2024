const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map(Number);
}
let N = 2000;

const enableDebug = false;
const debug = enableDebug ? console.log : () => {};
//-----------

console.log(solve());

//-----------

function solve(input = parseInput()) {
  let sum = 0;
  for (let seed of input) {
    let generator = secretsGenerator(seed);
    let val;
    for (let i = 0; i < N; i++) {
      let { value } = generator.next();
      val = value;
    }
    debug({ val });
    sum += val;
  }
  return sum;
}

function* secretsGenerator(seed) {
  while (true) {
    debug({ seed });
    seed = mix(prune(seed), prune(seed * 64));
    debug({ seed });
    seed = mix(prune(seed), prune(seed / 32));
    debug({ seed });
    seed = mix(prune(seed), prune(seed * 2048));
    debug({ seed });

    yield seed;
  }
}

function mix(a, b) {
  return a ^ b;
}

function prune(a) {
  return a % 16777216;
}
