def fibonacci(n):
    """
    Calculate the nth Fibonacci number using recursion.

    Args:
    n (int): The position in the Fibonacci sequence.

    Returns:
    int: The Fibonacci number at position n.

    Raises:
    ValueError: If n is negative.
    """
    if n < 0:
        raise ValueError("Fibonacci sequence is not defined for negative numbers.")

    # Base cases: First two Fibonacci numbers
    if n == 0:
        return 0
    elif n == 1:
        return 1

    # Recursive case: Sum of previous two Fibonacci numbers
    return fibonacci(n - 1) + fibonacci(n - 2)


# Example usage:
print(fibonacci(5))  # Expected output: 5
print(fibonacci(7))  # Expected output: 13
print(fibonacci(10)) # Expected output: 55