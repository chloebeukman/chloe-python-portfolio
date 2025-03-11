# 📖 Inventory Management System - User Guide

## 1️⃣ Introduction
The **Inventory Management System** is a simple tool that allows users to manage products, update stock levels, and track inventory.

## 2️⃣ Installation

### ✅ Requirements
- Python 3.10+
- SQLite (built into Python)
- Required dependencies (if any)

### ✅ Setup Instructions
1. **Clone the Repository**  
  
git clone https://github.com/yourusername/chloe-python-portfolio.git
cd chloe-python-portfolio/projects/system_architecture/inventory_management_system
Run Setup Script

python inventory/setup.py
This initializes the database and creates necessary tables.

3️⃣ Usage Guide
Feature	Command / Description
Add Product	Adds a new product with name, stock, price, category.
Update Product	Updates an existing product’s details.
Delete Product	Removes a product from the database.
Search Product	Searches for a product by name.
View Products	Displays all products in the inventory.
🔹 Running the Program
Run the program in the terminal:

python inventory_management.py

4️⃣ Troubleshooting
❌ sqlite3.OperationalError: no such table: products
✔️ Run the setup script:

python inventory/setup.py
❌ ModuleNotFoundError: inventory_management not found
✔️ Ensure you are in the correct directory before running scripts.