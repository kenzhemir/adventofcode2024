// https://projecteuler.net/problem=6

const expectedFor10 = 2640;
if (sum_square_diff(10) == expectedFor10) {
  console.log("✅ Test passed");
  console.log(
    "difference between the sum of the squares of the first one hundred natural numbers and the square of the sum: ",
    sum_square_diff(100)
  );
} else {
  console.log("❌ Test failed");
}

function sum_square_diff(n) {
  let sum = (n * (n + 1)) / 2;
  let square_of_sum = sum ** 2;
  let sum_of_squares = new Array(n + 1)
    .fill(0)
    .reduce((acc, _, i) => acc + i ** 2, 0);

  return square_of_sum - sum_of_squares;
}
