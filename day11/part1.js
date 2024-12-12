const fs = require("fs");
const { argv } = require("process");
function parseInput() {
  // return fs
  //   .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
  //   .split(" ");
  return [argv[2]];
}
//-----------

console.log(stoneCounter());

//-----------

function stoneCounter(input = parseInput()) {
  for (let i = 0; i < Number(process.argv[3]); i++) {
    input = blink(input);
  }
  // console.log(input.sort((a, b) => a - b));
  return input.length;
}

function blink(array) {
  // console.log(array);
  let newArray = [];
  for (let i = 0; i < array.length; i++) {
    let number = array[i];
    if (number == "0") {
      newArray.push("1");
      continue;
    }
    if (number.length % 2 == 0) {
      newArray.push(
        number.slice(0, number.length / 2),
        removeLeadingZeros(number.slice(number.length / 2)) || "0"
      );
      continue;
    }
    newArray.push("" + parseInt(number) * 2024);
    if (Number.isNaN(parseInt(number))) {
      throw new Error(`number is ${number}`);
    }
  }

  return newArray;
}

function removeLeadingZeros(string) {
  let i = 0;
  while (string[i] == "0") {
    i++;
  }
  return string.slice(i);
}
