function parseInput() {
  const fs = require("fs");
  return fs
    .readFileSync(require("path").join(__dirname, "input.txt"), "utf-8")
    .split("")
    .map(Number);
}

//-----------

console.log(optimizeDrive());

//-----------

function optimizeDrive(drive = parseInput()) {
  let checksum = 0;
  let offsets = new Array(drive.length).fill(0);
  let disk = [];
  for (let i = Math.floor(drive.length / 2) * 2; i >= 0; i -= 2) {
    let id = i / 2;
    let file_size = drive[i];
    let pos = 0;
    let file_checksum = 0;
    for (let j = 1; j < i; j += 2) {
      pos += drive[j - 1];
      let gap = drive[j] - offsets[j];
      if (file_size <= gap) {
        disk.splice(pos+ offsets[j], 0, ...new Array(file_size).fill(id));

        file_checksum = id * sum(pos + offsets[j], file_size);
        offsets[j] += file_size;
        break;
      }
      pos += drive[j];
    }

    if (!file_checksum) {
      disk.splice(pos, 0, ...new Array(file_size).fill(id));
      file_checksum = id * sum(pos, file_size);
    }
    checksum += file_checksum;
  }

  console.log(disk.join("|"));
  return checksum;
}

function sum(from, size) {
  let to = from + size - 1;
  return ((from + to) * (to - from + 1)) / 2;
}
