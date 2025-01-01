// https://projecteuler.net/problem=7

let input = 10001;
let test_input = 6;
let test_expected = 13;
let test_output = largest_product(test_input);
if (test_output == test_expected) {
  console.log("✅ Test passed");
  console.log("10001st prime number: ", largest_product(input));
} else {
  console.log(
    `❌ Test failed. Expected ${test_expected}, but got ${test_output}`
  );
}

function largest_product(n) {
  let generator = prime_number_generator();
  let result = 2;
  for (let i = 0; i < n; i++) {
    result = generator.next().value;
  }
  return result;
}

function* prime_number_generator() {
  let past_primes = [];
  let current = 2;
  while (true) {
    let is_prime = past_primes.every((prime) => current % prime != 0);
    if (is_prime) {
      past_primes.push(current);
      yield current;
    }
    current++;
  }
}
