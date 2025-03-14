# 📄 Code Documentation

## 🏗️ Project: Inventory Management System

### 📌 1. inventory_management.py

📌 Functions & Their Purpose

``` setup_database(db_name="database/inventory.db")

    - Description: Initializes the database and creates necessary tables (products and categories).
    - Parameters:
    db_name (str) → Path to the database file (default: database/inventory.db).
    - Returns: None

``` add_product(name, quantity, price, category_id, db_name="database/inventory.db")

    - Description: Adds a new product to the inventory.
    - Parameters:
        name (str) → Name of the product
        quantity (int) → Number of units
        price (float) → Price per unit
        category_id (int) → Category ID of the product
        db_name (str) → Path to the database file
    - Returns: None

``` update_product(product_id, name, quantity, price, category_id, db_name="database/inventory.db")

    - Description: Updates product details.
    - Parameters:
        product_id (int) → ID of the product to update
        name, quantity, price, category_id → Updated values
        db_name (str) → Path to the database file
    - Returns: None

``` delete_product(product_id, db_name="database/inventory.db")

    - Description: Removes a product from inventory.
    - Parameters:
        product_id (int) → ID of the product to delete
        db_name (str) → Path to the database file
    - Returns: None

``` search_product(search_term, db_name="database/inventory.db")

    - Description: Searches for a product by name.
    - Parameters:
        search_term (str) → Keyword to search for
        db_name (str) → Path to the database file
    - Returns: List of matching products

``` view_products(db_name="database/inventory.db")

    - Description: Retrieves all products in inventory.
    - Parameters:
        db_name (str) → Path to the database file
    - Returns: List of all products

### 📌 2. test_inventory_management.py

Unit Tests Overview

Each function is tested using Python's unittest module.

test_add_product() → Checks if a product is correctly added.

test_update_product() → Verifies product update functionality.

test_delete_product() → Ensures product deletion works as expected.

test_search_product() → Confirms search returns correct results.

test_view_products() → Validates retrieval of all products.

## 🛠️ Technology Stack

Language: Python

Database: SQLite

Testing: Unittest

Documentation: Markdown