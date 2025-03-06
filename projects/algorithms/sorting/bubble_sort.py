def bubble_sort(arr):
    """
    Sorts a list using the Bubble Sort algorithm.

    Arguments:
    arr (list): A list of numbers.

    Returns:
    list: The sorted list.

    Explanation:
    - Compares adjacent elements and swaps them if they are in the wrong order.
    - Repeats this process until the list is sorted.
    - Time Complexity: O(n^2) in worst and average cases, O(n) in best case (already sorted).
    """
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):  # Reduce comparisons in each pass
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # Swap if needed
                swapped = True
        if not swapped:  # If no swaps occurred, list is already sorted
            break
    return arr


# Example usage:
if __name__ == "__main__":
    sample_list = [64, 34, 25, 12, 22, 11, 90]
    print("Unsorted list:", sample_list)
    sorted_list = bubble_sort(sample_list)
    print("Sorted list:", sorted_list)