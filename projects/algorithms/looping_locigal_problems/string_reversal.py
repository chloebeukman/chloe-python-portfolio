def reverse_string_loop(s):
    """
    Reverse a string using a loop.

    Args:
    s (str): The input string.

    Returns:
    str: The reversed string.
    """
    reversed_s = ""
    for char in s:
        reversed_s = char + reversed_s  # Prepend each character
    return reversed_s


# Example Usage:
print(reverse_string_loop("hello"))   # Expected Output: "olleh"
print(reverse_string_loop("Python"))  # Expected Output: "nohtyP"