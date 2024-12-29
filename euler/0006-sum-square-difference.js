// https://projecteuler.net/problem=5

const expectedFor10 = 2520;
if (smallest_multiple(10) == expectedFor10) {
  console.log("✅ Test passed");
  console.log("Smallest Multiple from 1 to 20: ", smallest_multiple(20));
} else {
  console.log("❌ Test failed");
}

function* prime_factors(n) {
  let d = 2;
  while (n > 1) {
    while (n % d === 0) {
      yield d;
      n /= d;
    }
    d++;
  }
}

function smallest_multiple(n) {
  const factors = new Map();
  for (let i = 2; i <= n; i++) {
    const prime_factor_counts = {};
    for (const f of prime_factors(i)) {
      prime_factor_counts[f] = (prime_factor_counts[f] ?? 0) + 1;
    }
    for (const factor in prime_factor_counts) {
      factors.set(
        factor,
        Math.max(factors.get(factor) ?? 0, prime_factor_counts[factor])
      );
    }
  }

  let result = 1;
  for (const [factor, count] of factors) {
    result *= factor ** count;
  }
  return result;
}
