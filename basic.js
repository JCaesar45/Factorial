function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Test cases
console.log(factorial(2));  // 2
console.log(factorial(3));  // 6
console.log(factorial(5));  // 120
console.log(factorial(10)); // 3628800
