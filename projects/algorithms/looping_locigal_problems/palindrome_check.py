def is_palindrome(s):
    """
    Check if a given string is a palindrome.

    Args:
    s (str): The input string.

    Returns:
    bool: True if palindrome, False otherwise.
    """
    s = s.lower().replace(" ", "")  # Convert to lowercase and remove spaces
    return s == s[::-1]  # Compare original with reversed string


# Example Usage:
print(is_palindrome("racecar"))   # Expected Output: True
print(is_palindrome("hello"))     # Expected Output: False
print(is_palindrome("A man a plan a canal Panama"))  # Expected Output: True
print(is_palindrome("12321"))     # Expected Output: True
print(is_palindrome("Python"))    # Expected Output: False