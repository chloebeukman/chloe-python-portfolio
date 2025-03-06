def tower_of_hanoi(n, source, auxiliary, target):
    """
    Solve the Tower of Hanoi problem using recursion.

    Args:
    n (int): The number of disks.
    source (str): The name of the source peg.
    auxiliary (str): The name of the auxiliary peg.
    target (str): The name of the target peg.

    Returns:
    None: Prints the steps to solve the problem.
    """
    if n == 1:
        print(f"Move disk 1 from {source} to {target}")
        return

    # Move n-1 disks from source to auxiliary peg using target as a helper
    tower_of_hanoi(n - 1, source, target, auxiliary)

    # Move the nth disk directly from source to target peg
    print(f"Move disk {n} from {source} to {target}")

    # Move the n-1 disks from auxiliary to target peg using source as a helper
    tower_of_hanoi(n - 1, auxiliary, source, target)


# Example usage:
num_disks = 3  # Change this value to test with different numbers of disks
tower_of_hanoi(num_disks, "A", "B", "C")