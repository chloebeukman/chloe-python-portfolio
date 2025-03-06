def binary_search(arr, target):
    """
    Performs Binary Search on a sorted list.

    Arguments:
    arr (list): A sorted list of numbers.
    target (int): The number to search for.

    Returns:
    int: The index of the target element if found, else -1.

    Explanation:
    - Binary Search follows a divide-and-conquer approach.
    - It repeatedly divides the list into halves until the target is found.
    - Works only on sorted lists.
    - Time Complexity: O(log n) (very efficient for large datasets).
    - Space Complexity: O(1) (iterative version).
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2  # Find the middle index

        # Check if target is at mid
        if arr[mid] == target:
            return mid
        # If target is smaller, search in the left half
        elif arr[mid] > target:
            right = mid - 1
        # If target is larger, search in the right half
        else:
            left = mid + 1

    return -1  # Target not found


# Example usage:
if __name__ == "__main__":
    sorted_list = [1, 3, 5, 7, 9, 11, 13, 15]
    target_number = 7
    result = binary_search(sorted_list, target_number)

    if result != -1:
        print(f"Element {target_number} found at index {result}.")
    else:
        print(f"Element {target_number} not found.")