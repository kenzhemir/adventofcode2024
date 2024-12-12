const { timeStamp } = require("console");
const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split(" ");
}

let memo = {};
// console.log(nextAnswers2);

//-----------

console.log(stoneCounter());

//-----------

function stoneCounter(input = parseInput()) {
  let a = input.reduce((acc, curr) => {
    return acc + blink(curr, Number(process.argv[2]));
  }, 0);
  return a;
}

function memoize(fn) {
  const cache = {};
  return function (...args) {
    if (cache[args]) {
      return cache[args];
    }
    const output = fn(...args);
    cache[args] = output;
    return output;
  };
}

function blink(number, left) {
  let memoKey = `${number}-${left}`;
  if (left == 0) {
    return 1;
  }
  if (memo[memoKey]) {
    return memo[memoKey];
  }
  if (number == "0") {
    let ans = blink("1", left - 1);
    memo[memoKey] = ans;
    return ans;
  }
  if (number.length % 2 == 0) {
    let ans =
      blink(number.slice(0, number.length / 2), left - 1) +
      blink(
        removeLeadingZeros(number.slice(number.length / 2)) || "0",
        left - 1
      );
    memo[memoKey] = ans;
    return ans;
  }
  let ans = blink("" + parseInt(number) * 2024, left - 1);
  memo[memoKey] = ans;
  return ans;
}

function removeLeadingZeros(string) {
  let i = 0;
  while (string[i] == "0") {
    i++;
  }
  return string.slice(i);
}
