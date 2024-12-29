// https://projecteuler.net/problem=2

let expected_for_100 = 44;
let result_for_100 = even_fibbonacci_sum(100);
if (result_for_100 == expected_for_100) {
  console.log("✅ Test passed");
  console.log(
    "Sum of even fibonacci numbers below 4 million: ",
    even_fibbonacci_sum(4_000_000)
  );
} else {
  console.log(
    `❌ Test failed. Expected ${expected_for_100}, but got ${result_for_100}`
  );
}

function* fib(max) {
  let prev = 1;
  let curr = 2;

  while (curr < max) {
    if (curr % 2 === 0) {
      yield curr;
    }
    [prev, curr] = [curr, prev + curr];
  }
}

function even_fibbonacci_sum(max) {
  const generator = fib(max);

  let sum = 0;
  let next = generator.next();
  while (!next.done) {
    sum += next.value;
    next = generator.next();
  }
  return sum;
}
