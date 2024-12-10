let number = 600_851_475_143;

function primeFactors() {
  let divisor = 2;
  while (number > 1) {
    if (number % divisor == 0) {
      number /= divisor;
    } else {
      divisor++;
    }
  }
  console.log(divisor);
}

primeFactors();
