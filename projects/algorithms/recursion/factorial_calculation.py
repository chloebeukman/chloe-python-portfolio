def factorial(n):
    """
    Calculate the factorial of a given number using recursion.

    Args:
    n (int): The number to calculate the factorial of.

    Returns:
    int: Factorial of n.

    Raises:
    ValueError: If n is negative.
    """
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    
    # Base case: 0! and 1! are both 1
    if n == 0 or n == 1:
        return 1

    # Recursive case: n * factorial of (n-1)
    return n * factorial(n - 1)


# Example usage:
print(factorial(5))  # Expected output: 120
print(factorial(7))  # Expected output: 5040