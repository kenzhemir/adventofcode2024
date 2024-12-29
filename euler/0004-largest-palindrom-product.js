// https://projecteuler.net/problem=4

const expectedFor2 = 9009;
if (largest_triple_palindrome(2) == expectedFor2) {
  console.log("✅ Test passed");
  console.log(
    "Largest Triple Palindrome from 3 digits: ",
    largest_triple_palindrome(3)
  );
} else {
  console.log("❌ Test failed");
}

function largest_triple_palindrome(digits) {
  let min = Math.pow(10, digits - 1);
  let max = Math.pow(10, digits) - 1;
  let maxPalindrome = 0;
  for (let i = max; i >= min; i--) {
    for (let j = max; j >= min; j--) {
      if (isMultipleAPalindrome(i, j)) {
        maxPalindrome = Math.max(maxPalindrome, i * j);
      }
    }
  }

  return maxPalindrome;
}

function isMultipleAPalindrome(n, m) {
  return n * m === reverseNumber(n * m);
}

function reverseNumber(n) {
  return parseInt(n.toString().split("").reverse().join(""));
}
