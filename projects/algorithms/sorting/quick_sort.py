def quick_sort(arr):
    """
    Sorts a list using the Quick Sort algorithm.

    Arguments:
    arr (list): A list of numbers.

    Returns:
    list: The sorted list.

    Explanation:
    - Quick Sort is a divide-and-conquer algorithm.
    - It selects a pivot and partitions the list into elements smaller and greater than the pivot.
    - Recursively sorts the partitions.
    - Average & Best Case Time Complexity: O(n log n).
    - Worst Case Time Complexity: O(n²) (when the smallest or largest element is always chosen as the pivot).
    - Space Complexity: O(log n) due to recursive calls.
    """
    if len(arr) <= 1:
        return arr  # Base case: a single element is already sorted

    pivot = arr[len(arr) // 2]  # Choosing the middle element as pivot
    left = [x for x in arr if x < pivot]  # Elements less than pivot
    middle = [x for x in arr if x == pivot]  # Elements equal to pivot
    right = [x for x in arr if x > pivot]  # Elements greater than pivot

    return quick_sort(left) + middle + quick_sort(right)


# Example usage:
if __name__ == "__main__":
    sample_list = [10, 7, 8, 9, 1, 5]
    print("Unsorted list:", sample_list)
    sorted_list = quick_sort(sample_list)
    print("Sorted list:", sorted_list)