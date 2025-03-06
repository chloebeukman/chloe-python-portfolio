def insertion_sort(arr):
    """
    Sorts a list using the Insertion Sort algorithm.

    Arguments:
    arr (list): A list of numbers.

    Returns:
    list: The sorted list.

    Explanation:
    - Insertion Sort builds a sorted sequence one element at a time.
    - It shifts larger elements to the right to make space for the current element.
    - Best Case Time Complexity: O(n) (already sorted list).
    - Average & Worst Case Time Complexity: O(n²).
    - Space Complexity: O(1) (in-place sorting).
    - Works well for small or nearly sorted datasets.
    """
    for i in range(1, len(arr)):
        key = arr[i]  # The element to be placed correctly
        j = i - 1

        # Move elements of arr[0..i-1], that are greater than key, one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key  # Insert the key at the correct position

    return arr


# Example usage:
if __name__ == "__main__":
    sample_list = [12, 11, 13, 5, 6]
    print("Unsorted list:", sample_list)
    sorted_list = insertion_sort(sample_list)
    print("Sorted list:", sorted_list)