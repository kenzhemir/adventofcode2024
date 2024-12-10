const fs = require("fs");
function parseInput() {
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("")
    .map(Number);
}

let finalstring = "";
//-----------

console.log(shorter());

//-----------

function optimizeDrive(drive = parseInput()) {
  let checksum = 0;

  let filledBlocks = 0;
  let leftBlock = 0;
  let rightBlock = Math.floor((drive.length - 1) / 2) * 2;

  while (leftBlock < rightBlock || drive[leftBlock] > 0) {
    const blocksToFill = drive[leftBlock];
    const leftBlockId = leftBlock / 2;

    // console.log({ leftBlock, leftBlockId, blocksToFill, filledBlocks });
    finalstring += new Array(blocksToFill).fill(leftBlockId).join(",") + ",";
    checksum += leftBlockId * sum(filledBlocks, blocksToFill);
    filledBlocks += blocksToFill;
    // console.log({ checksum });

    let gapSize = drive[leftBlock + 1];

    // console.log("Gap size: " + gapSize);
    while (gapSize > 0 && rightBlock > leftBlock) {
      let blocksToFill = drive[rightBlock];
      const rightBlockID = rightBlock / 2;
      // console.log({
      //   rightBlock,
      //   rightBlockID,
      //   blocksToFill,
      //   filledBlocks,
      // });

      if (blocksToFill > gapSize) {
        finalstring += new Array(gapSize).fill(rightBlockID).join(",") + ",";
        drive[rightBlock] -= gapSize;
        checksum += rightBlockID * sum(filledBlocks, gapSize);
        filledBlocks += gapSize;
        gapSize = 0;
      } else {
        finalstring +=
          new Array(blocksToFill).fill(rightBlockID).join(",") + ",";
        checksum += rightBlockID * sum(filledBlocks, blocksToFill);
        drive[rightBlock] = 0;
        filledBlocks += blocksToFill;
        gapSize -= blocksToFill;
        rightBlock -= 2;
      }

      // console.log({ checksum });
    }

    leftBlock += 2;
  }

  fs.writeFileSync(require("path").join(__dirname, "output.txt"), finalstring);

  return checksum;
}

function sum(from, size) {
  let to = from + size - 1;
  return ((from + to) * (to - from + 1)) / 2;
}

function shorter(disk = parseInput()) {
  disk = disk.flatMap((x, i) =>
    i % 2 ? new Array(x).fill(-1) : new Array(x).fill(i / 2)
  );
  let left = 0;
  let right = disk.length - 1;

  while (true) {
    while (disk[left] >= 0) left++;
    while (disk[right] < 0) right--;
    if (left >= right) break;
    disk[left] = disk[right];
    disk[right] = -1;
  }
  return disk.reduce((acc, el, i) => acc + (el > 0 ? el * i : 0), 0);
}
