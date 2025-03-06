class Stack:
    """
    A simple Stack implementation using a Python list.

    Methods:
    push(value) - Adds a value to the top of the stack.
    pop() - Removes and returns the top value from the stack.
    peek() - Returns the top value without removing it.
    is_empty() - Checks if the stack is empty.
    size() - Returns the number of elements in the stack.
    """
    def __init__(self):
        self.stack = []

    def push(self, value):
        """Adds a value to the top of the stack."""
        self.stack.append(value)

    def pop(self):
        """Removes and returns the top value from the stack."""
        if self.is_empty():
            raise IndexError("Stack is empty. Cannot pop.")
        return self.stack.pop()

    def peek(self):
        """Returns the top value without removing it."""
        if self.is_empty():
            return None
        return self.stack[-1]

    def is_empty(self):
        """Checks if the stack is empty."""
        return len(self.stack) == 0

    def size(self):
        """Returns the number of elements in the stack."""
        return len(self.stack)


# Example Usage:
stack = Stack()
stack.push(5)
stack.push(10)
stack.push(15)
print(stack.peek())  # Expected Output: 15
print(stack.pop())   # Expected Output: 15
print(stack.pop())   # Expected Output: 10
print(stack.is_empty())  # Expected Output: False
print(stack.pop())   # Expected Output: 5
print(stack.is_empty())  # Expected Output: True