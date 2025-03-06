def is_prime(n):
    """
    Check if a number is prime.

    Args:
    n (int): The number to check.

    Returns:
    bool: True if prime, False otherwise.
    """
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True


# Example Usage:
print(is_prime(2))   # Expected Output: True
print(is_prime(11))  # Expected Output: True
print(is_prime(25))  # Expected Output: False
print(is_prime(1))   # Expected Output: False
print(is_prime(97))  # Expected Output: True