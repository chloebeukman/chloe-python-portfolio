class HashTable:
    """
    A simple Hash Table implementation using Python's built-in dictionary.

    Methods:
    insert(key, value) - Adds a key-value pair to the table.
    get(key) - Retrieves a value by key.
    delete(key) - Removes a key-value pair from the table.
    contains(key) - Checks if a key exists in the table.
    keys() - Returns all stored keys.
    values() - Returns all stored values.
    """
    def __init__(self):
        self.table = {}

    def insert(self, key, value):
        """Adds a key-value pair to the table."""
        self.table[key] = value

    def get(self, key):
        """Retrieves a value by key."""
        return self.table.get(key, None)

    def delete(self, key):
        """Removes a key-value pair from the table."""
        if key in self.table:
            del self.table[key]

    def contains(self, key):
        """Checks if a key exists in the table."""
        return key in self.table

    def keys(self):
        """Returns all stored keys."""
        return list(self.table.keys())

    def values(self):
        """Returns all stored values."""
        return list(self.table.values())


# Example Usage:
hash_table = HashTable()
hash_table.insert("name", "Chloe")
hash_table.insert("age", 33)
hash_table.insert("city", "Cape Town")

print(hash_table.get("name"))  # Expected Output: Chloe
print(hash_table.get("age"))  # Expected Output: 33
print(hash_table.contains("city"))  # Expected Output: True

hash_table.delete("age")
print(hash_table.get("age"))  # Expected Output: None
print(hash_table.keys())  # Expected Output: ['name', 'city']
print(hash_table.values())  # Expected Output: ['Chloe', 'Cape Town']