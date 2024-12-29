const fs = require("fs");
function parseInput() {
  let locksAndKeys = fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n\n");
  let locks = locksAndKeys.filter((block) => block.startsWith("#####"));
  let keys = locksAndKeys.filter((block) => block.startsWith("....."));
  locks = locks.map((lock) => heightMap(lock));
  keys = keys.map((key) => heightMap(key));
  return { locks, keys };
}

function heightMap(block) {
  const lines = block.split("\n").slice(1, -1);
  let heights = [];
  for (let i = 0; i < 5; i++) {
    let height = 0;
    for (let j = 0; j < 5; j++) {
      if (lines[j][i] === "#") {
        height += 1;
      }
    }
    heights.push(height);
  }
  return heights;
}
Array.prototype.tap = function () {
  console.log(this);
  return this;
};

//-----------

console.log(solve());

//-----------

function solve({ locks, keys } = parseInput()) {
  console.log(locks, keys);
  let count = 0;
  for (let lock of locks) {
    for (let key of keys) {
      if (isMatch(lock, key)) {
        count += 1;
      }
    }
  }
  return count;
}

function isMatch(lock, key) {
  return lock.every((lockHeight, i) => lockHeight + key[i] <= 5);
}
