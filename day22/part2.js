const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map(Number);
}

const enableDebug = false;
const debug = enableDebug ? console.log : () => {};
//-----------

// console.log(solve([123], 10));
console.log(solve());

//-----------

function solve(input = parseInput(), N = 2000) {
  // let sum = 0;
  const buyers = input.map((buyerSeed) => {
    let generator = secretsGenerator(buyerSeed);
    let diffs = [];
    let prev = buyerSeed;
    let prices = [prev % 10];
    for (let i = 1; i < N; i++) {
      let { value: curr } = generator.next();
      prices.push(curr % 10);
      diffs.push((curr % 10) - (prev % 10));
      prev = curr;
    }
    return { prices, diffs };
  });
  allPossibleBuyerSequences(buyers);
  console.log({ buyer: buyers[0] });
  let sequences = allPossibleSequences();
  let max = -Infinity;
  let mss = [];
  for (let sequence of sequences) {
    let mapkey = sequence.join(",");
    let total = buyers.reduce((acc, { map, prices }, i) => {
      let index = map.get(mapkey);
      if (index === undefined) {
        // console.log({ i, index });
        return acc;
      }
      // console.log({ i, index, price: prices[index + 1] });
      return acc + prices[index];
    }, 0);
    if (total > max) {
      max = total;
      mss = [sequence];
    } else if (total === max) {
      mss.push(sequence);
    }
  }
  return { max, mss };
}

function trySequence(sequence, diffs) {
  for (let i = 0; i < diffs.length - sequence.length; i++) {
    for (let j = 0; j < sequence.length; j++) {
      if (diffs[i + j] !== sequence[j]) {
        break;
      }
      if (j === sequence.length - 1) {
        return i + j;
      }
    }
  }
}

function calculateNextMinMax([min, max], diff) {
  let newMax = Math.min(9, max + diff);
  let newMin = Math.max(0, min + diff);
  if (newMax < 0 || newMin > 9 || newMax < newMin) {
    return undefined;
  }
  return [newMin, newMax];
}

function allPossibleBuyerSequences(buyers) {
  for (let buyer of buyers) {
    let { diffs } = buyer;
    let map = new Map();
    for (let i = 0; i < diffs.length - 4; i++) {
      let key = diffs.slice(i, i + 4).join(",");
      if (map.has(key)) {
        continue;
      }
      map.set(diffs.slice(i, i + 4).join(","), i + 4);
    }
    buyer.map = map;
  }
}
//price varies from 0 to 9
function allPossibleSequences() {
  let possibleDiffs = new Array(19).fill(0).map((_, i) => i - 9);
  let sequences = structuredClone(
    possibleDiffs.map((diff) => ({
      seq: [diff],
      minMax: calculateNextMinMax([0, 9], diff),
    }))
  );
  for (let i = 0; i < 3; i++) {
    sequences = sequences.flatMap(({ seq, minMax }) =>
      possibleDiffs
        .map((diff) => {
          let newMinMax = calculateNextMinMax(minMax, diff);
          if (newMinMax) {
            return {
              seq: seq.concat(diff),
              minMax: newMinMax,
            };
          }
        })
        .filter(Boolean)
    );
  }
  return sequences.map((seq) => seq.seq);
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
