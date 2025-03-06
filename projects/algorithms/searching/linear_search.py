def linear_search(arr, target):
    """
    Performs Linear Search on a list.

    Arguments:
    arr (list): A list of numbers.
    target (int): The number to search for.

    Returns:
    int: The index of the target element if found, else -1.

    Explanation:
    - Linear Search checks each element one by one.
    - It works on both sorted and unsorted lists.
    - Time Complexity: O(n) (inefficient for large datasets).
    - Space Complexity: O(1).
    """
    for index, value in enumerate(arr):
        if value == target:
            return index  # Return the index of the found element
    return -1  # Target not found


# Example usage:
if __name__ == "__main__":
    sample_list = [4, 2, 9, 7, 1, 5, 8]
    target_number = 7
    result = linear_search(sample_list, target_number)

    if result != -1:
        print(f"Element {target_number} found at index {result}.")
    else:
        print(f"Element {target_number} not found.")