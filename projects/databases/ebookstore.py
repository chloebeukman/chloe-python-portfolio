import sqlite3

# Define database setup function
def setup_database():
    """ Sets up the database and creates the book table if it doesn't exist. """
    conn = sqlite3.connect('ebookstore.db')
    cursor = conn.cursor()
    
    # Create the table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            qty INTEGER NOT NULL
        )
    ''')

    # Initial books
    initial_books = [
        (3001, 'A Tale of Two Cities', 'Charles Dickens', 30),
        (3002, 'Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 40),
        (3003, 'The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 25),
        (3004, 'The Lord of the Rings', 'J.R.R. Tolkien', 37),
        (3005, 'Alice in Wonderland', 'Lewis Carroll', 12)
    ]

    cursor.executemany('INSERT OR IGNORE INTO book VALUES (?, ?, ?, ?)', initial_books)
    conn.commit()
    conn.close()

# Function to add a book
def enter_book():
    """ Adds a new book to the database. """
    try:
        book_id = int(input("Enter Book ID: "))
        title = input("Enter Book Title: ").strip()
        author = input("Enter Author Name: ").strip()
        qty = int(input("Enter Quantity: "))

        conn = sqlite3.connect('ebookstore.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO book (id, title, author, qty) VALUES (?, ?, ?, ?)", 
                       (book_id, title, author, qty))
        conn.commit()
        conn.close()

        print("\n✅ Book added successfully!")
    except ValueError:
        print("\n❌ Invalid input. Please enter numbers where required.")
    except sqlite3.IntegrityError:
        print("\n❌ Error: A book with this ID already exists.")

# Function to update a book
def update_book():
    """ Updates an existing book in the database. """
    try:
        book_id = int(input("Enter the Book ID to update: "))

        conn = sqlite3.connect('ebookstore.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM book WHERE id = ?", (book_id,))
        book = cursor.fetchone()

        if book:
            print(f"\nCurrent Title: {book[1]}\nCurrent Author: {book[2]}\nCurrent Quantity: {book[3]}")
            title = input("Enter new Title (press Enter to keep current): ").strip() or book[1]
            author = input("Enter new Author (press Enter to keep current): ").strip() or book[2]
            qty = input("Enter new Quantity (press Enter to keep current): ")

            qty = int(qty) if qty else book[3]

            cursor.execute("UPDATE book SET title = ?, author = ?, qty = ? WHERE id = ?", 
                           (title, author, qty, book_id))
            conn.commit()
            print("\n✅ Book updated successfully!")
        else:
            print("\n❌ Book not found.")
        
        conn.close()
    except ValueError:
        print("\n❌ Invalid input. Please enter numbers where required.")

# Function to delete a book
def delete_book():
    """ Deletes a book from the database. """
    try:
        book_id = int(input("Enter the Book ID to delete: "))

        conn = sqlite3.connect('ebookstore.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM book WHERE id = ?", (book_id,))
        book = cursor.fetchone()

        if book:
            confirm = input(f"\nAre you sure you want to delete '{book[1]}'? (y/n): ").strip().lower()
            if confirm == 'y':
                cursor.execute("DELETE FROM book WHERE id = ?", (book_id,))
                conn.commit()
                print("\n✅ Book deleted successfully!")
            else:
                print("\n❌ Deletion cancelled.")
        else:
            print("\n❌ Book not found.")
        
        conn.close()
    except ValueError:
        print("\n❌ Invalid input. Please enter numbers where required.")

# Function to search for a book with pagination
def search_books():
    """ Searches for books by title or author with pagination. """
    search_term = input("\nEnter a title or author to search: ").strip()

    conn = sqlite3.connect('ebookstore.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM book WHERE title LIKE ? OR author LIKE ?", 
                   (f"%{search_term}%", f"%{search_term}%"))
    results = cursor.fetchall()
    conn.close()

    if results:
        page_size = 3
        for i in range(0, len(results), page_size):
            print("\n📚 Search Results:")
            for book in results[i:i+page_size]:
                print(f"ID: {book[0]} | Title: {book[1]} | Author: {book[2]} | Qty: {book[3]}")
            
            if i + page_size < len(results):
                next_page = input("\nPress Enter to see more results or type 'q' to quit: ")
                if next_page.lower() == 'q':
                    break
    else:
        print("\n❌ No books found.")

# Main function to handle the menu
def main():
    """ Displays the menu and handles user interactions. """
    setup_database()

    while True:
        print("\n📚 eBookstore Menu:")
        print("1️⃣ Add a Book")
        print("2️⃣ Update a Book")
        print("3️⃣ Delete a Book")
        print("4️⃣ Search for Books")
        print("0️⃣ Exit")

        choice = input("\nEnter your choice: ")

        if choice == '1':
            enter_book()
        elif choice == '2':
            update_book()
        elif choice == '3':
            delete_book()
        elif choice == '4':
            search_books()
        elif choice == '0':
            print("\n👋 Goodbye!")
            break
        else:
            print("\n❌ Invalid choice. Please select a valid option.")

if __name__ == "__main__":
    main()