📖 Installation & Setup

1️⃣ Prerequisites
Before using the Inventory Management System, ensure you have:
    Python 3.x installed
    SQLite3 (included with Python by default)
    A terminal or command prompt

2️⃣ Clone the Repository
If you haven’t already, clone the project from GitHub:
    git clone https://github.com/yourusername/chloe-python-portfolio.git
Navigate into the project directory:
    cd chloe-python-portfolio/projects/system_architecture/inventory_management

3️⃣ Install Dependencies
The system currently runs on standard Python libraries, so no additional installations are required. However, you can set up a virtual environment for better dependency management:
    python -m venv env
    source env/bin/activate  # macOS/Linux
    env\Scripts\activate  # Windows
Then, install dependencies if needed:
    pip install -r requirements.txt  # If a requirements.txt file exists

4️⃣ Initialize the Database
The system uses SQLite for data storage. To set up the database, run:
    python inventory.py
This will create the necessary tables if they don’t already exist.

5️⃣ Run the Program
Start the Inventory Management System:
    python inventory.py
Follow the on-screen menu to add, update, delete, or search for products.