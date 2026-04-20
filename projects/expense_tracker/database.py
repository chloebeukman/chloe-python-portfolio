"""
database.py
-----------
Handles all SQLite database operations for the Expense Tracker app.
Creates and manages the expenses, income, and goals tables.
"""

import sqlite3
from datetime import datetime


DB_NAME = "expense_tracker.db"


def get_connection():
    """Return a connection to the SQLite database."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Allows column access by name
    return conn


def initialise_database():
    """Create all required tables if they don't already exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT DEFAULT 'General',
            date TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT DEFAULT 'General',
            date TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            target_amount REAL NOT NULL,
            saved_amount REAL DEFAULT 0.0,
            deadline TEXT
        );
    """)

    conn.commit()
    conn.close()


# ---------- INCOME ----------

def add_income(description, amount, category, date):
    conn = get_connection()
    conn.execute(
        "INSERT INTO income (description, amount, category, date) VALUES (?, ?, ?, ?)",
        (description, amount, category, date)
    )
    conn.commit()
    conn.close()


def get_all_income():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM income ORDER BY date DESC").fetchall()
    conn.close()
    return rows


def update_income(record_id, description, amount, category, date):
    conn = get_connection()
    conn.execute(
        "UPDATE income SET description=?, amount=?, category=?, date=? WHERE id=?",
        (description, amount, category, date, record_id)
    )
    conn.commit()
    conn.close()


def delete_income(record_id):
    conn = get_connection()
    conn.execute("DELETE FROM income WHERE id=?", (record_id,))
    conn.commit()
    conn.close()


# ---------- EXPENSES ----------

def add_expense(description, amount, category, date):
    conn = get_connection()
    conn.execute(
        "INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)",
        (description, amount, category, date)
    )
    conn.commit()
    conn.close()


def get_all_expenses():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM expenses ORDER BY date DESC").fetchall()
    conn.close()
    return rows


def update_expense(record_id, description, amount, category, date):
    conn = get_connection()
    conn.execute(
        "UPDATE expenses SET description=?, amount=?, category=?, date=? WHERE id=?",
        (description, amount, category, date, record_id)
    )
    conn.commit()
    conn.close()


def delete_expense(record_id):
    conn = get_connection()
    conn.execute("DELETE FROM expenses WHERE id=?", (record_id,))
    conn.commit()
    conn.close()


# ---------- BUDGET ----------

def get_total_income():
    conn = get_connection()
    result = conn.execute("SELECT COALESCE(SUM(amount), 0) FROM income").fetchone()[0]
    conn.close()
    return result


def get_total_expenses():
    conn = get_connection()
    result = conn.execute("SELECT COALESCE(SUM(amount), 0) FROM expenses").fetchone()[0]
    conn.close()
    return result


# ---------- GOALS ----------

def add_goal(name, target_amount, saved_amount, deadline):
    conn = get_connection()
    conn.execute(
        "INSERT INTO goals (name, target_amount, saved_amount, deadline) VALUES (?, ?, ?, ?)",
        (name, target_amount, saved_amount, deadline)
    )
    conn.commit()
    conn.close()


def get_all_goals():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM goals").fetchall()
    conn.close()
    return rows


def update_goal_savings(goal_id, new_saved_amount):
    conn = get_connection()
    conn.execute(
        "UPDATE goals SET saved_amount=? WHERE id=?",
        (new_saved_amount, goal_id)
    )
    conn.commit()
    conn.close()


def delete_goal(goal_id):
    conn = get_connection()
    conn.execute("DELETE FROM goals WHERE id=?", (goal_id,))
    conn.commit()
    conn.close()
