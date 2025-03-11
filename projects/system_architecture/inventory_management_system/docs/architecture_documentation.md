#📄 System Architecture Documentation

##🏗️ Project: Inventory Management System

📌 1. Folder Structure

📂 inventory_management_system/
│── 📂 database/  
│   ├── inventory.db   # SQLite database file  
│── 📂 docs/
│   ├── architecture_documentation.md 
│   ├── code_documentation.md  
│   ├── database_schema.md
│   ├── testing_documentation.md  
│   ├── user_guide.md 
│── 📂 inventory/
│   ├── inventory_management.py  # Core logic  
│── 📂 tests/  
│   ├── __init__.py
│   ├── test_inventory_management.py  # Unit tests  
│── __init__.py  
│── README.md  
│── requirements.txt  

📌 2. System Overview
The Inventory Management System is a Python-based application that allows users to manage products in an SQLite database.
The system provides CRUD (Create, Read, Update, Delete) operations for inventory management.

📌 3. Database Schema
products Table
Column      | Type          | Description
----------------------------------------------------
id	        | INTEGER       | Unique product ID (PK)
name	    | TEXT          | Product name
quantity	| INTEGER	    | Available stock
price       | REAL          | Product price
category_id | INTEGER       | Foreign key (category)

categories Table
Column      | Type          | Description
----------------------------------------------------
id	        | INTEGER       | Unique category ID (PK)
name        | TEXT          | Category name

📌 4. Core Components
Component                   | Description
----------------------------------------------------
inventory_management.py	    | Manages database operations
test_inventory_management.py| Runs unit tests
inventory.db	            | SQLite database file
docs/	                    | Documentation folder

📌 5. System Workflow
1️⃣ Setup:
The database is created using setup_database().
Necessary tables (products, categories) are initialized.

2️⃣ Operations:
Adding a product → add_product()
Updating a product → update_product()
Deleting a product → delete_product()
Searching products → search_product()
Viewing all products → view_products()