function* fib() {
  let prev = 1;
  let curr = 2;

  while (curr < 4_000_000) {
    if (curr % 2 === 0) {
      yield curr;
    }
    [prev, curr] = [curr, prev + curr];
  }
}

function run() {
  const generator = fib();

  let sum = 0;
  let next = generator.next();
  while (!next.done) {
    sum += next.value;
    next = generator.next();
  }
  return sum;
}

console.log(run());
