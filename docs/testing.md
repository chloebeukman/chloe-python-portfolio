# 🛠️ Testing the Inventory Management System

## 1️⃣ Overview
The `test_inventory_management.py` file contains unit tests for the **Inventory Management System**. These tests ensure that key functionalities such as adding, updating, deleting, searching, and viewing products work as expected.

## 2️⃣ Test Cases

| **Test Name**          | **Description**                                  |
|------------------------|--------------------------------------------------|
| `test_add_product`     | Tests if a new product is successfully added.    |
| `test_update_product`  | Ensures product details can be updated.         |
| `test_delete_product`  | Verifies that a product can be deleted.         |
| `test_search_product`  | Checks if searching for a product returns data. |
| `test_view_products`   | Ensures all products are displayed correctly.   |

## 3️⃣ How to Run Tests
### ✅ Step 1: Navigate to Project Directory
Open a terminal and navigate to the `inventory_management_system` folder:
```sh
cd path/to/inventory_management_system

✅ Step 2: Run Tests Using unittest
Run all tests with:

sh
Copy
Edit
python -m unittest discover -s tests
To run only a specific test, use:

sh
Copy
Edit
python -m unittest tests.test_inventory_management.TestInventoryManagement.test_add_product

4️⃣ Expected Output
If all tests pass, you should see:

markdown
Copy
Edit
.....
----------------------------------------------------------------------
Ran 5 tests in X.XXXs

OK
If any test fails, an error message will indicate which test did not pass and why.

5️⃣ Troubleshooting
Ensure you have Python installed.
Make sure you are in the correct directory.
If a module cannot be found, check your Python environment setup.