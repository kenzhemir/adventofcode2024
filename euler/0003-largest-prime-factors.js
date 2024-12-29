// https://projecteuler.net/problem=3

let expected = 29;
if (primeFactors(13195) == expected) {
  console.log("✅ Test passed");
  console.log("Largest Prime Factor: ", primeFactors(600851475143));
} else {
  console.log("❌ Test failed");
}

function primeFactors(n) {
  let divisor = 2;
  while (n > 1) {
    if (n % divisor == 0) {
      n /= divisor;
    } else {
      divisor++;
    }
  }
  return divisor;
}
