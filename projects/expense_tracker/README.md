# 💰 Expense Tracker App

A desktop finance management application built with Python and Tkinter, using SQLite for persistent local storage.

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)
![Tkinter](https://img.shields.io/badge/GUI-Tkinter-blue?style=flat-square)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)

---

## ✨ Features

- **Income tracking** — add, edit, and delete income records with categories and dates
- **Expense tracking** — log and manage all outgoing expenses
- **Budget overview** — live calculation of total income vs spending with a running balance
- **Financial goals** — set savings goals with target amounts, progress bars, and optional deadlines
- **Persistent storage** — all data is saved locally in an SQLite database

---

## 🖥️ Screenshots

> _Will add screenshots here_

---

## 🛠️ Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Language    | Python 3.8+       |
| GUI         | Tkinter (ttk)     |
| Database    | SQLite3           |
| Architecture| OOP / MVC-inspired|

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher (no external libraries required)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/chloebeukman/chloe-python-portfolio.git

# Navigate to the project
cd chloe-python-portfolio/projects/expense_tracker

# Run the app
python expense_tracker.py
```

The app will create an `expense_tracker.db` file on first run to store your data.

---

## 📁 Project Structure

```
expense_tracker/
├── expense_tracker.py   # Main application & GUI
├── database.py          # All SQLite database operations
└── README.md
```

---

## 💡 What I Learned

- Structuring a Python project across multiple modules
- Building a responsive GUI with Tkinter and ttk widgets
- Implementing full CRUD operations with SQLite
- Separating concerns between UI logic and data logic
- Input validation and user-friendly error handling

---

## 👩‍💻 Author

**Chloe Beukman** · [GitHub](https://github.com/chloebeukman) · [LinkedIn](https://www.linkedin.com/in/chloe-beukman)
