import sqlite3

def setup_database(db_name="inventory.db"):
    """Initialize the database and create tables if they don't exist."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        quantity INTEGER NOT NULL DEFAULT 0,
        price REAL NOT NULL DEFAULT 0.0
    )
    """)
    
    conn.commit()
    conn.close()

def add_product(name, quantity, price, db_name="inventory.db"):
    """Add a new product to the database."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)", 
                       (name, quantity, price))
        conn.commit()
        return cursor.lastrowid
    except sqlite3.IntegrityError:
        print("Error: Product with this name already exists.")
        return None
    finally:
        conn.close()

def update_product(product_id, name, quantity, price, db_name="inventory.db"):
    """Update an existing product in the database."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute("UPDATE products SET name=?, quantity=?, price=? WHERE id=?", 
                   (name, quantity, price, product_id))
    conn.commit()
    conn.close()

def delete_product(product_id, db_name="inventory.db"):
    """Delete a product from the database."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM products WHERE id=?", (product_id,))
    conn.commit()
    conn.close()

def search_product(search_term, db_name="inventory.db"):
    """Search for a product by name."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM products WHERE name LIKE ?", ('%' + search_term + '%',))
    results = cursor.fetchall()
    
    conn.close()
    return results

def view_products(db_name="inventory.db"):
    """Retrieve all products from the database."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    
    conn.close()
    return products

# Ensure the database is set up when the module is imported
setup_database()