public class Factorial {
    public static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        if (n == 0 || n == 1) {
            return 1;
        }
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(factorial(2));   // 2
        System.out.println(factorial(3));   // 6
        System.out.println(factorial(5));   // 120
        System.out.println(factorial(10));  // 3628800
    }
}
