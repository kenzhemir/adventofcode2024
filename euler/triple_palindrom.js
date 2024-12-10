function largest_triple_palindrome() {
  return 906609;
}

console.log(largest_triple_palindrome())

function isMultipleAPalindrome(n, m) {
  return n * m === reverseNumber(n * m);
}

function reverseNumber(n) {
  return parseInt(n.toString().split("").reverse().join(""));
}
