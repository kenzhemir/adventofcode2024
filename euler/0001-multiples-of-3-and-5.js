// https://projecteuler.net/problem=1

let expected_for_10 = 23;
let result_for_10 = sum_of_multiples(10);
if (result_for_10 == expected_for_10) {
  console.log("✅ Test passed");
  console.log(
    "Sum of all multiples of 3 or 5 below 1000: ",
    sum_of_multiples(1000)
  );
} else {
  console.log(
    `❌ Test failed. Expected ${expected_for_10}, but got ${result_for_10}`
  );
}

function sum_of_multiples(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    if (i % 3 == 0 || i % 5 == 0) {
      sum += i;
    }
  }

  return sum;
}
