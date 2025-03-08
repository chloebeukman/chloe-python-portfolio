import sqlite3

def initialize_database():
    """
    Creates and initializes the SQLite database if it does not already exist.
    
    The database contains two tables:
    1. categories: Stores product categories.
    2. products: Stores product details, linked to categories.

    If the tables already exist, this function does nothing.
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    # Create categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    ''')

    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price REAL NOT NULL DEFAULT 0.0,
            stock INTEGER NOT NULL DEFAULT 0,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
        )
    ''')

    conn.commit()
    conn.close()


def add_product(name, price, stock, category_id):
    """
    Adds a new product to the inventory.
    
    Parameters:
        name (str): Name of the product.
        price (float): Price of the product in Rands.
        stock (int): Number of units available.
        category_id (int): ID of the product category.

    Returns:
        None
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO products (name, price, stock, category_id) VALUES (?, ?, ?, ?)",
                       (name, price, stock, category_id))
        conn.commit()
        print(f"✅ Product '{name}' added successfully.")
    except sqlite3.IntegrityError:
        print(f"❌ Error: Product '{name}' already exists.")
    conn.close()


def update_product(product_id, name=None, price=None, stock=None, category_id=None):
    """
    Updates an existing product's details.
    
    Parameters:
        product_id (int): The ID of the product to update.
        name (str, optional): New name for the product.
        price (float, optional): New price for the product in Rands.
        stock (int, optional): Updated stock quantity.
        category_id (int, optional): Updated category ID.

    Returns:
        None
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    updates = []
    values = []

    if name:
        updates.append("name = ?")
        values.append(name)
    if price is not None:
        updates.append("price = ?")
        values.append(price)
    if stock is not None:
        updates.append("stock = ?")
        values.append(stock)
    if category_id:
        updates.append("category_id = ?")
        values.append(category_id)

    values.append(product_id)

    if updates:
        query = f"UPDATE products SET {', '.join(updates)} WHERE product_id = ?"
        cursor.execute(query, values)
        conn.commit()
        print(f"✅ Product with ID {product_id} updated successfully.")
    
    conn.close()


def delete_product(product_id):
    """
    Deletes a product from the inventory.

    Parameters:
        product_id (int): The ID of the product to be deleted.

    Returns:
        None
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM products WHERE product_id = ?", (product_id,))
    conn.commit()

    if cursor.rowcount > 0:
        print(f"✅ Product with ID {product_id} deleted successfully.")
    else:
        print(f"❌ Error: Product with ID {product_id} not found.")

    conn.close()


def search_product(search_term):
    """
    Searches for a product by name.

    Parameters:
        search_term (str): A partial or full product name to search for.

    Returns:
        list: A list of matching product records.
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE name LIKE ?", (f"%{search_term}%",))
    results = cursor.fetchall()
    conn.close()

    if results:
        print("\n🔎 Search Results:")
        for product in results:
            print(f"ID: {product[0]}, Name: {product[1]}, Price: R{product[2]:.2f}, Stock: {product[3]}")
    else:
        print("❌ No products found.")


def view_inventory():
    """
    Displays all products in the inventory.

    Returns:
        None
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    cursor.execute('''
        SELECT p.product_id, p.name, p.price, p.stock, c.name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
    ''')
    
    products = cursor.fetchall()
    conn.close()

    if products:
        print("\n📦 Inventory List:")
        for product in products:
            print(f"ID: {product[0]}, Name: {product[1]}, Price: R{product[2]:.2f}, Stock: {product[3]}, Category: {product[4]}")
    else:
        print("❌ No products in inventory.")


def add_category(category_name):
    """
    Adds a new category to the inventory system.

    Parameters:
        category_name (str): Name of the category.

    Returns:
        None
    """
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO categories (name) VALUES (?)", (category_name,))
        conn.commit()
        print(f"✅ Category '{category_name}' added successfully.")
    except sqlite3.IntegrityError:
        print(f"❌ Error: Category '{category_name}' already exists.")

    conn.close()


def main():
    """
    Main function to interact with the inventory system through a menu-driven interface.

    Returns:
        None
    """
    initialize_database()

    while True:
        print("\n📋 Inventory Management Menu:")
        print("1️⃣ Add Product")
        print("2️⃣ Update Product")
        print("3️⃣ Delete Product")
        print("4️⃣ Search Product")
        print("5️⃣ View Inventory")
        print("6️⃣ Add Category")
        print("0️⃣ Exit")

        choice = input("\nEnter your choice: ")

        if choice == "1":
            name = input("Enter product name: ")
            price = float(input("Enter price (Rands): "))
            stock = int(input("Enter stock quantity: "))
            category_id = int(input("Enter category ID (or 0 for none): "))
            category_id = category_id if category_id != 0 else None
            add_product(name, price, stock, category_id)

        elif choice == "2":
            product_id = int(input("Enter product ID to update: "))
            name = input("New name (leave blank to keep unchanged): ")
            price = input("New price (leave blank to keep unchanged): ")
            stock = input("New stock (leave blank to keep unchanged): ")
            category_id = input("New category ID (leave blank to keep unchanged): ")

            update_product(
                product_id,
                name if name else None,
                float(price) if price else None,
                int(stock) if stock else None,
                int(category_id) if category_id else None,
            )

        elif choice == "3":
            product_id = int(input("Enter product ID to delete: "))
            delete_product(product_id)

        elif choice == "4":
            search_term = input("Enter product name to search: ")
            search_product(search_term)

        elif choice == "5":
            view_inventory()

        elif choice == "6":
            category_name = input("Enter category name: ")
            add_category(category_name)

        elif choice == "0":
            print("👋 Exiting... Goodbye!")
            break

        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()