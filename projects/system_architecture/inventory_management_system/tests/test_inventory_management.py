import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
import sqlite3
import os

from inventory_management import (
    setup_database, add_product, update_product, 
    delete_product, search_product, view_products
)

class TestInventoryManagement(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up a temporary database before running tests."""
        cls.test_db = "test_inventory.db"
        cls.conn = sqlite3.connect(cls.test_db)
        cls.cursor = cls.conn.cursor()
        setup_database(cls.test_db)  # Initialize schema

    @classmethod
    def tearDownClass(cls):
        """Close connection and remove test database after tests."""
        cls.conn.close()
        os.remove(cls.test_db)

    def setUp(self):
        """Clear products table before each test."""
        self.cursor.execute("DELETE FROM products")
        self.conn.commit()

    def test_add_product(self):
        """Test adding a new product."""
        add_product("Test Product", 10, 99.99, self.test_db)
        self.cursor.execute("SELECT * FROM products WHERE name='Test Product'")
        product = self.cursor.fetchone()
        self.assertIsNotNone(product)
        self.assertEqual(product[1], "Test Product")
        self.assertEqual(product[2], 10)
        self.assertEqual(product[3], 99.99)

    def test_update_product(self):
        """Test updating a product."""
        add_product("Old Product", 5, 50.0, self.test_db)
        self.cursor.execute("SELECT id FROM products WHERE name='Old Product'")
        product_id = self.cursor.fetchone()[0]

        update_product(product_id, "Updated Product", 20, 75.0, self.test_db)
        self.cursor.execute("SELECT * FROM products WHERE id=?", (product_id,))
        updated_product = self.cursor.fetchone()
        self.assertEqual(updated_product[1], "Updated Product")
        self.assertEqual(updated_product[2], 20)
        self.assertEqual(updated_product[3], 75.0)

    def test_delete_product(self):
        """Test deleting a product."""
        add_product("Delete Me", 8, 30.0, self.test_db)
        self.cursor.execute("SELECT id FROM products WHERE name='Delete Me'")
        product_id = self.cursor.fetchone()[0]

        delete_product(product_id, self.test_db)
        self.cursor.execute("SELECT * FROM products WHERE id=?", (product_id,))
        self.assertIsNone(self.cursor.fetchone())

    def test_search_product(self):
        """Test searching for a product."""
        add_product("Search Test", 15, 120.0, self.test_db)
        results = search_product("Search", self.test_db)
        self.assertGreater(len(results), 0)
        self.assertEqual(results[0][1], "Search Test")

    def test_view_products(self):
        """Test viewing all products."""
        add_product("Product 1", 10, 99.99, self.test_db)
        add_product("Product 2", 5, 49.99, self.test_db)
        products = view_products(self.test_db)
        self.assertGreaterEqual(len(products), 2)

if __name__ == "__main__":
    unittest.main()