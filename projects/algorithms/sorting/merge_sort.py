def merge_sort(arr):
    """
    Sorts a list using the Merge Sort algorithm.

    Arguments:
    arr (list): A list of numbers.

    Returns:
    list: The sorted list.

    Explanation:
    - Recursively divides the list into halves until single elements remain.
    - Merges the halves back together in sorted order.
    - Time Complexity: O(n log n) in all cases.
    - Space Complexity: O(n) due to auxiliary arrays.
    """
    if len(arr) <= 1:
        return arr  # Base case: a single element is already sorted

    # Split the array into two halves
    mid = len(arr) // 2
    left_half = merge_sort(arr[:mid])
    right_half = merge_sort(arr[mid:])

    return merge(left_half, right_half)


def merge(left, right):
    """
    Merges two sorted lists into a single sorted list.

    Arguments:
    left (list): The left sorted half.
    right (list): The right sorted half.

    Returns:
    list: Merged and sorted list.
    """
    sorted_arr = []
    i = j = 0

    # Merge elements from left and right halves in sorted order
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            sorted_arr.append(left[i])
            i += 1
        else:
            sorted_arr.append(right[j])
            j += 1

    # Append any remaining elements
    sorted_arr.extend(left[i:])
    sorted_arr.extend(right[j:])

    return sorted_arr


# Example usage:
if __name__ == "__main__":
    sample_list = [38, 27, 43, 3, 9, 82, 10]
    print("Unsorted list:", sample_list)
    sorted_list = merge_sort(sample_list)
    print("Sorted list:", sorted_list)