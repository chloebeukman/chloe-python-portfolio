class Node:
    """
    A Node in a singly linked list.

    Attributes:
    data (any): The value stored in the node.
    next (Node or None): The reference to the next node in the list.
    """
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    """
    A simple Singly Linked List implementation.

    Methods:
    insert(value) - Adds a node with the given value to the end of the list.
    display() - Prints the linked list elements.
    search(value) - Checks if a value exists in the linked list.
    delete(value) - Removes the first occurrence of a value from the linked list.
    """
    def __init__(self):
        self.head = None

    def insert(self, value):
        """Inserts a new node at the end of the list."""
        new_node = Node(value)
        if not self.head:
            self.head = new_node
            return
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node

    def display(self):
        """Prints all elements in the linked list."""
        elements = []
        temp = self.head
        while temp:
            elements.append(str(temp.data))
            temp = temp.next
        print(" -> ".join(elements) + " -> None")

    def search(self, value):
        """Searches for a value in the list and returns True if found."""
        temp = self.head
        while temp:
            if temp.data == value:
                return True
            temp = temp.next
        return False

    def delete(self, value):
        """Deletes the first occurrence of a value from the list."""
        if not self.head:
            return

        if self.head.data == value:
            self.head = self.head.next
            return

        prev = None
        temp = self.head
        while temp and temp.data != value:
            prev = temp
            temp = temp.next

        if temp:
            prev.next = temp.next


# Example Usage:
ll = LinkedList()
ll.insert(10)
ll.insert(20)
ll.insert(30)
ll.display()  # Expected Output: 10 -> 20 -> 30 -> None

print(ll.search(20))  # Expected Output: True
print(ll.search(40))  # Expected Output: False

ll.delete(20)
ll.display()  # Expected Output: 10 -> 30 -> None