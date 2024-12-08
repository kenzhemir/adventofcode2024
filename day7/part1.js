function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("\n")
    .map((row) => {
      let [res, rest] = row.split(":");
      return [Number(res), rest.trimStart().split(" ").map(Number)];
    });
}

//-----------

console.log(permutateNumbers());

//-----------

function permutateNumbers(input = parseInput()) {
  let result = 0;
  for (let [target, nums] of input) {
    if (findPermutaion(target, nums.slice(1), nums[0])) {
      // console.log(result, target);
      result += target;
    }
  }
  return result;
}

function findPermutaion(target, nums, acc) {
  if (acc === target && nums.length == 0) {
    return true;
  }
  if (acc > target) {
    return false;
  }
  if (nums.length == 0) {
    return false;
  }

  let [head, ...tail] = nums;

  return (
    findPermutaion(target, tail, acc + head) ||
    findPermutaion(target, tail, acc * head)
  );
}
