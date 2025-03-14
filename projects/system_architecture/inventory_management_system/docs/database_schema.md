# 📂 Database Schema  

## 📌 Database Name: `inventory.db`  
The database contains two tables: `products` and `categories`, which store inventory details.  

---

## 📋 Table: `products`  
| Column Name  | Data Type  | Constraints                   |
|-------------|-----------|--------------------------------|
| product_id  | INTEGER   | PRIMARY KEY, AUTOINCREMENT    |
| name        | TEXT      | NOT NULL, UNIQUE              |
| price       | REAL      | NOT NULL                      |
| stock       | INTEGER   | NOT NULL                      |
| category_id | INTEGER   | FOREIGN KEY (categories)      |

---

## 📋 Table: `categories`  
| Column Name  | Data Type  | Constraints                   |
|-------------|-----------|--------------------------------|
| category_id | INTEGER   | PRIMARY KEY, AUTOINCREMENT    |
| name        | TEXT      | NOT NULL, UNIQUE              |

---

## 🛠️ SQL Table Creation Queries  

CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    price REAL NOT NULL DEFAULT 0.0,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

🔍 Database Operations

1️⃣ Insert a Product

INSERT INTO products (name, quantity, price) VALUES ('Product Name', 10, 99.99);

2️⃣ Update a Product

UPDATE products SET name = 'New Name', quantity = 20, price = 120.50 WHERE id = 1;

3️⃣ Delete a Product

DELETE FROM products WHERE id = 1;

4️⃣ Search for a Product

SELECT * FROM products WHERE name LIKE '%search_term%';

5️⃣ View All Products

SELECT * FROM products;