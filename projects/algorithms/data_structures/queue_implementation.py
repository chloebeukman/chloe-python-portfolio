class Queue:
    """
    A simple Queue implementation using a Python list.

    Methods:
    enqueue(value) - Adds a value to the end of the queue.
    dequeue() - Removes and returns the value from the front of the queue.
    peek() - Returns the front value without removing it.
    is_empty() - Checks if the queue is empty.
    size() - Returns the number of elements in the queue.
    """
    def __init__(self):
        self.queue = []

    def enqueue(self, value):
        """Adds a value to the end of the queue."""
        self.queue.append(value)

    def dequeue(self):
        """Removes and returns the front value from the queue."""
        if self.is_empty():
            raise IndexError("Queue is empty. Cannot dequeue.")
        return self.queue.pop(0)

    def peek(self):
        """Returns the front value without removing it."""
        if self.is_empty():
            return None
        return self.queue[0]

    def is_empty(self):
        """Checks if the queue is empty."""
        return len(self.queue) == 0

    def size(self):
        """Returns the number of elements in the queue."""
        return len(self.queue)


# Example Usage:
queue = Queue()
queue.enqueue(5)
queue.enqueue(10)
queue.enqueue(15)
print(queue.peek())  # Expected Output: 5
print(queue.dequeue())  # Expected Output: 5
print(queue.dequeue())  # Expected Output: 10
print(queue.is_empty())  # Expected Output: False
print(queue.dequeue())  # Expected Output: 15
print(queue.is_empty())  # Expected Output: True