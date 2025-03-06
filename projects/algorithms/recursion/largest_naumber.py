def largest_number(numbers, idx=0, current_max=None):
    """
    Recursively finds the largest number in a list.

    Args:
        numbers (list): A list of integers.
        idx (int): Current index in recursion.
        current_max (int or None): The largest number found so far.

    Returns:
        int: The largest number in the list.

    Raises:
        ValueError: If the list is empty.
    """
    if not numbers:
        raise ValueError("The list is empty. Cannot find the largest number.")
    
    # Initialize current_max on first call
    if current_max is None:
        current_max = numbers[0]
    
    # Base case: if we reach the end of the list, return the max
    if idx == len(numbers):
        return current_max
    
    # Update current_max if needed
    current_max = max(current_max, numbers[idx])
    
    # Recursive call
    return largest_number(numbers, idx + 1, current_max)


# ✅ Example Test Cases:
print(largest_number([1, 4, 5, 3]))  # Expected: 5
print(largest_number([3, 1, 6, 8, 2, 4, 5]))  # Expected: 8
print(largest_number([-10, -3, -5, -1]))  # Expected: -1
print(largest_number([42]))  # Expected: 42
print(largest_number([1000, 5000, 9999, 8888, 7777]))  # Expected: 9999