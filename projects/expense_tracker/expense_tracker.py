"""
expense_tracker.py
------------------
Main entry point for the Expense Tracker desktop application.
Built with Python and Tkinter, using SQLite for persistent storage.

Features:
    - Add, edit, and delete income and expenses
    - Budget overview (total income vs total spending)
    - Financial goal tracking with progress indicators

Run with:
    python expense_tracker.py
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
import database as db


# ─────────────────────────────────────────────
#  Colour palette & font constants
# ─────────────────────────────────────────────
BG_DARK      = "#1e1e2e"
BG_PANEL     = "#2a2a3e"
BG_CARD      = "#313145"
ACCENT_GREEN = "#4ecca3"
ACCENT_RED   = "#e06c75"
ACCENT_BLUE  = "#61afef"
ACCENT_GOLD  = "#e5c07b"
TEXT_PRIMARY = "#cdd6f4"
TEXT_MUTED   = "#6c7086"

FONT_TITLE   = ("Helvetica", 18, "bold")
FONT_HEADING = ("Helvetica", 12, "bold")
FONT_BODY    = ("Helvetica", 10)
FONT_SMALL   = ("Helvetica", 9)


# ─────────────────────────────────────────────
#  Helper: styled button factory
# ─────────────────────────────────────────────
def make_button(parent, text, command, colour=ACCENT_BLUE, width=14):
    return tk.Button(
        parent, text=text, command=command,
        bg=colour, fg=BG_DARK, font=FONT_BODY,
        relief="flat", cursor="hand2", width=width,
        activebackground=TEXT_PRIMARY, activeforeground=BG_DARK,
        padx=6, pady=4
    )


# ─────────────────────────────────────────────
#  Dialog: Add / Edit a transaction
# ─────────────────────────────────────────────
class TransactionDialog(tk.Toplevel):
    """Reusable dialog for adding or editing income / expense records."""

    CATEGORIES = [
        "General", "Food & Drink", "Housing", "Transport",
        "Health", "Entertainment", "Education", "Savings", "Other"
    ]

    def __init__(self, parent, title, on_save, prefill=None):
        super().__init__(parent)
        self.title(title)
        self.configure(bg=BG_PANEL)
        self.resizable(False, False)
        self.grab_set()             # Modal behaviour
        self.on_save = on_save

        # ── Fields ──
        fields = [("Description", "desc"), ("Amount (R)", "amount"),
                  ("Category", "category"), ("Date (YYYY-MM-DD)", "date")]

        self.vars = {}
        for row, (label, key) in enumerate(fields):
            tk.Label(self, text=label, bg=BG_PANEL, fg=TEXT_PRIMARY,
                     font=FONT_BODY).grid(row=row, column=0, sticky="w",
                                          padx=16, pady=6)

            if key == "category":
                var = tk.StringVar(value=prefill[key] if prefill else "General")
                widget = ttk.Combobox(self, textvariable=var,
                                      values=self.CATEGORIES, state="readonly",
                                      width=22, font=FONT_BODY)
            else:
                var = tk.StringVar(
                    value=prefill[key] if prefill else
                    (datetime.today().strftime("%Y-%m-%d") if key == "date" else "")
                )
                widget = tk.Entry(self, textvariable=var, width=25,
                                  bg=BG_CARD, fg=TEXT_PRIMARY,
                                  insertbackground=TEXT_PRIMARY,
                                  relief="flat", font=FONT_BODY)

            widget.grid(row=row, column=1, padx=16, pady=6)
            self.vars[key] = var

        # ── Save button ──
        make_button(self, "Save", self._save, ACCENT_GREEN).grid(
            row=len(fields), column=0, columnspan=2, pady=14)

    def _save(self):
        desc   = self.vars["desc"].get().strip()
        amount = self.vars["amount"].get().strip()
        cat    = self.vars["category"].get().strip()
        date   = self.vars["date"].get().strip()

        if not desc:
            messagebox.showwarning("Missing field", "Please enter a description.", parent=self)
            return
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except ValueError:
            messagebox.showwarning("Invalid amount", "Please enter a positive number.", parent=self)
            return

        self.on_save(desc, amount, cat, date)
        self.destroy()


# ─────────────────────────────────────────────
#  Dialog: Add / Edit a financial goal
# ─────────────────────────────────────────────
class GoalDialog(tk.Toplevel):
    def __init__(self, parent, on_save, prefill=None):
        super().__init__(parent)
        self.title("Add Financial Goal")
        self.configure(bg=BG_PANEL)
        self.resizable(False, False)
        self.grab_set()
        self.on_save = on_save

        labels = ["Goal name", "Target amount (R)",
                  "Already saved (R)", "Deadline (YYYY-MM-DD, optional)"]
        keys   = ["name", "target", "saved", "deadline"]
        defaults = prefill if prefill else {}

        self.vars = {}
        for row, (label, key) in enumerate(zip(labels, keys)):
            tk.Label(self, text=label, bg=BG_PANEL, fg=TEXT_PRIMARY,
                     font=FONT_BODY).grid(row=row, column=0, sticky="w",
                                          padx=16, pady=6)
            var = tk.StringVar(value=defaults.get(key, ""))
            tk.Entry(self, textvariable=var, width=25,
                     bg=BG_CARD, fg=TEXT_PRIMARY,
                     insertbackground=TEXT_PRIMARY,
                     relief="flat", font=FONT_BODY).grid(
                         row=row, column=1, padx=16, pady=6)
            self.vars[key] = var

        make_button(self, "Save Goal", self._save, ACCENT_GOLD).grid(
            row=len(labels), column=0, columnspan=2, pady=14)

    def _save(self):
        name     = self.vars["name"].get().strip()
        deadline = self.vars["deadline"].get().strip() or None

        if not name:
            messagebox.showwarning("Missing field", "Please enter a goal name.", parent=self)
            return
        try:
            target = float(self.vars["target"].get())
            saved  = float(self.vars["saved"].get() or 0)
            if target <= 0:
                raise ValueError
        except ValueError:
            messagebox.showwarning("Invalid amount",
                                   "Target must be a positive number.", parent=self)
            return

        self.on_save(name, target, saved, deadline)
        self.destroy()


# ─────────────────────────────────────────────
#  Main Application Window
# ─────────────────────────────────────────────
class ExpenseTrackerApp(tk.Tk):

    def __init__(self):
        super().__init__()
        self.title("Expense Tracker")
        self.geometry("900x620")
        self.configure(bg=BG_DARK)
        self.resizable(True, True)

        db.initialise_database()
        self._selected_income_id   = None
        self._selected_expense_id  = None
        self._selected_goal_id     = None

        self._build_header()
        self._build_notebook()
        self._refresh_all()

    # ── Header ──────────────────────────────
    def _build_header(self):
        header = tk.Frame(self, bg=BG_PANEL, pady=12)
        header.pack(fill="x")
        tk.Label(header, text="💰 Expense Tracker",
                 bg=BG_PANEL, fg=ACCENT_GREEN,
                 font=FONT_TITLE).pack(side="left", padx=20)
        self.budget_label = tk.Label(header, text="",
                                     bg=BG_PANEL, fg=TEXT_PRIMARY,
                                     font=FONT_BODY)
        self.budget_label.pack(side="right", padx=20)

    # ── Notebook tabs ────────────────────────
    def _build_notebook(self):
        style = ttk.Style()
        style.theme_use("default")
        style.configure("TNotebook",       background=BG_DARK, borderwidth=0)
        style.configure("TNotebook.Tab",   background=BG_PANEL, foreground=TEXT_MUTED,
                        padding=[14, 6], font=FONT_BODY)
        style.map("TNotebook.Tab",
                  background=[("selected", BG_CARD)],
                  foreground=[("selected", ACCENT_GREEN)])

        nb = ttk.Notebook(self)
        nb.pack(fill="both", expand=True, padx=10, pady=10)

        self.income_tab   = self._make_transaction_tab(nb, "income")
        self.expense_tab  = self._make_transaction_tab(nb, "expense")
        self.budget_tab   = self._make_budget_tab(nb)
        self.goals_tab    = self._make_goals_tab(nb)

        nb.add(self.income_tab,  text="  Income  ")
        nb.add(self.expense_tab, text="  Expenses  ")
        nb.add(self.budget_tab,  text="  Budget  ")
        nb.add(self.goals_tab,   text="  Goals  ")

    # ── Transaction tab (income OR expenses) ─
    def _make_transaction_tab(self, parent, kind):
        """
        Builds a reusable tab for both income and expense records.
        kind: "income" or "expense"
        """
        frame = tk.Frame(parent, bg=BG_DARK)

        # Treeview
        cols = ("ID", "Description", "Amount", "Category", "Date")
        tree = ttk.Treeview(frame, columns=cols, show="headings",
                            height=15, selectmode="browse")
        accent = ACCENT_GREEN if kind == "income" else ACCENT_RED

        style = ttk.Style()
        style.configure("Treeview",
                        background=BG_CARD, fieldbackground=BG_CARD,
                        foreground=TEXT_PRIMARY, rowheight=26,
                        font=FONT_BODY)
        style.configure("Treeview.Heading",
                        background=BG_PANEL, foreground=accent,
                        font=FONT_HEADING)

        col_widths = {"ID": 40, "Description": 260,
                      "Amount": 100, "Category": 140, "Date": 110}
        for col in cols:
            tree.heading(col, text=col)
            tree.column(col, width=col_widths[col], anchor="center")

        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)
        tree.pack(side="left", fill="both", expand=True, padx=(10, 0), pady=10)
        scrollbar.pack(side="left", fill="y", pady=10)

        # Button panel
        btn_frame = tk.Frame(frame, bg=BG_DARK)
        btn_frame.pack(side="right", fill="y", padx=10, pady=10)

        if kind == "income":
            make_button(btn_frame, "+ Add Income",
                        self._add_income, ACCENT_GREEN).pack(pady=6)
            make_button(btn_frame, "✏ Edit",
                        self._edit_income, ACCENT_BLUE).pack(pady=6)
            make_button(btn_frame, "🗑 Delete",
                        self._delete_income, ACCENT_RED).pack(pady=6)
            tree.bind("<<TreeviewSelect>>",
                      lambda e: self._on_select(tree, "income"))
            self.income_tree = tree
        else:
            make_button(btn_frame, "+ Add Expense",
                        self._add_expense, ACCENT_RED).pack(pady=6)
            make_button(btn_frame, "✏ Edit",
                        self._edit_expense, ACCENT_BLUE).pack(pady=6)
            make_button(btn_frame, "🗑 Delete",
                        self._delete_expense, ACCENT_RED).pack(pady=6)
            tree.bind("<<TreeviewSelect>>",
                      lambda e: self._on_select(tree, "expense"))
            self.expense_tree = tree

        return frame

    # ── Budget tab ───────────────────────────
    def _make_budget_tab(self, parent):
        frame = tk.Frame(parent, bg=BG_DARK)

        tk.Label(frame, text="Budget Overview",
                 bg=BG_DARK, fg=ACCENT_GREEN,
                 font=FONT_TITLE).pack(pady=(20, 6))

        card = tk.Frame(frame, bg=BG_CARD, padx=30, pady=20)
        card.pack(pady=10, padx=40, fill="x")

        self.budget_income_lbl   = tk.Label(card, text="", bg=BG_CARD,
                                            fg=ACCENT_GREEN, font=FONT_HEADING)
        self.budget_expense_lbl  = tk.Label(card, text="", bg=BG_CARD,
                                            fg=ACCENT_RED, font=FONT_HEADING)
        self.budget_balance_lbl  = tk.Label(card, text="", bg=BG_CARD,
                                            fg=TEXT_PRIMARY, font=FONT_TITLE)

        for lbl in (self.budget_income_lbl,
                    self.budget_expense_lbl,
                    self.budget_balance_lbl):
            lbl.pack(anchor="w", pady=4)

        return frame

    # ── Goals tab ────────────────────────────
    def _make_goals_tab(self, parent):
        frame = tk.Frame(parent, bg=BG_DARK)

        tk.Label(frame, text="Financial Goals",
                 bg=BG_DARK, fg=ACCENT_GOLD,
                 font=FONT_TITLE).pack(pady=(20, 6))

        self.goals_frame = tk.Frame(frame, bg=BG_DARK)
        self.goals_frame.pack(fill="both", expand=True, padx=20)

        btn_row = tk.Frame(frame, bg=BG_DARK)
        btn_row.pack(pady=10)
        make_button(btn_row, "+ Add Goal", self._add_goal, ACCENT_GOLD).pack(
            side="left", padx=6)
        make_button(btn_row, "🗑 Delete Goal", self._delete_goal, ACCENT_RED).pack(
            side="left", padx=6)

        return frame

    # ─────────────────────────────────────────
    #  Refresh methods
    # ─────────────────────────────────────────
    def _refresh_all(self):
        self._refresh_income()
        self._refresh_expenses()
        self._refresh_budget()
        self._refresh_goals()

    def _refresh_income(self):
        self.income_tree.delete(*self.income_tree.get_children())
        for row in db.get_all_income():
            self.income_tree.insert("", "end",
                values=(row["id"], row["description"],
                        f"R {row['amount']:.2f}",
                        row["category"], row["date"]))

    def _refresh_expenses(self):
        self.expense_tree.delete(*self.expense_tree.get_children())
        for row in db.get_all_expenses():
            self.expense_tree.insert("", "end",
                values=(row["id"], row["description"],
                        f"R {row['amount']:.2f}",
                        row["category"], row["date"]))

    def _refresh_budget(self):
        total_in  = db.get_total_income()
        total_out = db.get_total_expenses()
        balance   = total_in - total_out
        colour    = ACCENT_GREEN if balance >= 0 else ACCENT_RED

        self.budget_income_lbl.config(
            text=f"Total Income:    R {total_in:,.2f}")
        self.budget_expense_lbl.config(
            text=f"Total Expenses:  R {total_out:,.2f}")
        self.budget_balance_lbl.config(
            text=f"Balance:         R {balance:,.2f}", fg=colour)

        # Update header
        self.budget_label.config(
            text=f"Balance: R {balance:,.2f}", fg=colour)

    def _refresh_goals(self):
        for widget in self.goals_frame.winfo_children():
            widget.destroy()
        self._selected_goal_id = None

        goals = db.get_all_goals()
        if not goals:
            tk.Label(self.goals_frame,
                     text="No goals yet. Add one to get started!",
                     bg=BG_DARK, fg=TEXT_MUTED,
                     font=FONT_BODY).pack(pady=20)
            return

        for goal in goals:
            self._render_goal_card(goal)

    def _render_goal_card(self, goal):
        pct      = min(goal["saved_amount"] / goal["target_amount"], 1.0)
        pct_text = f"{pct * 100:.0f}%"
        remaining = goal["target_amount"] - goal["saved_amount"]

        card = tk.Frame(self.goals_frame, bg=BG_CARD, padx=16, pady=10,
                        cursor="hand2")
        card.pack(fill="x", pady=5)
        card.bind("<Button-1>",
                  lambda e, gid=goal["id"]: self._select_goal(gid, card))

        top = tk.Frame(card, bg=BG_CARD)
        top.pack(fill="x")
        tk.Label(top, text=f"🎯 {goal['name']}", bg=BG_CARD,
                 fg=ACCENT_GOLD, font=FONT_HEADING).pack(side="left")
        tk.Label(top, text=pct_text, bg=BG_CARD,
                 fg=ACCENT_GREEN, font=FONT_BODY).pack(side="right")

        # Progress bar
        bar_bg = tk.Frame(card, bg=TEXT_MUTED, height=8)
        bar_bg.pack(fill="x", pady=(4, 2))
        bar_bg.update_idletasks()
        fill_w = int(bar_bg.winfo_reqwidth() * pct)
        tk.Frame(bar_bg, bg=ACCENT_GREEN, height=8,
                 width=fill_w).place(x=0, y=0)

        detail = (f"Saved: R {goal['saved_amount']:,.2f}  /  "
                  f"Target: R {goal['target_amount']:,.2f}  |  "
                  f"Still needed: R {remaining:,.2f}")
        if goal["deadline"]:
            detail += f"  |  Deadline: {goal['deadline']}"
        tk.Label(card, text=detail, bg=BG_CARD,
                 fg=TEXT_MUTED, font=FONT_SMALL).pack(anchor="w")

    # ─────────────────────────────────────────
    #  Selection helpers
    # ─────────────────────────────────────────
    def _on_select(self, tree, kind):
        selected = tree.selection()
        if not selected:
            return
        record_id = tree.item(selected[0])["values"][0]
        if kind == "income":
            self._selected_income_id = record_id
        else:
            self._selected_expense_id = record_id

    def _select_goal(self, goal_id, card):
        self._selected_goal_id = goal_id
        # Visual highlight
        for widget in self.goals_frame.winfo_children():
            widget.configure(bg=BG_CARD)
            for child in widget.winfo_children():
                try:
                    child.configure(bg=BG_CARD)
                except Exception:
                    pass
        card.configure(bg=BG_PANEL)

    # ─────────────────────────────────────────
    #  Income CRUD
    # ─────────────────────────────────────────
    def _add_income(self):
        def save(desc, amount, cat, date):
            db.add_income(desc, amount, cat, date)
            self._refresh_all()
        TransactionDialog(self, "Add Income", save)

    def _edit_income(self):
        if not self._selected_income_id:
            messagebox.showinfo("No selection", "Please select an income record to edit.")
            return
        rows = db.get_all_income()
        row  = next((r for r in rows if r["id"] == self._selected_income_id), None)
        if not row:
            return
        prefill = {"desc": row["description"], "amount": str(row["amount"]),
                   "category": row["category"], "date": row["date"]}
        def save(desc, amount, cat, date):
            db.update_income(self._selected_income_id, desc, amount, cat, date)
            self._refresh_all()
        TransactionDialog(self, "Edit Income", save, prefill=prefill)

    def _delete_income(self):
        if not self._selected_income_id:
            messagebox.showinfo("No selection", "Please select a record to delete.")
            return
        if messagebox.askyesno("Confirm delete", "Delete this income record?"):
            db.delete_income(self._selected_income_id)
            self._selected_income_id = None
            self._refresh_all()

    # ─────────────────────────────────────────
    #  Expense CRUD
    # ─────────────────────────────────────────
    def _add_expense(self):
        def save(desc, amount, cat, date):
            db.add_expense(desc, amount, cat, date)
            self._refresh_all()
        TransactionDialog(self, "Add Expense", save)

    def _edit_expense(self):
        if not self._selected_expense_id:
            messagebox.showinfo("No selection", "Please select an expense record to edit.")
            return
        rows = db.get_all_expenses()
        row  = next((r for r in rows if r["id"] == self._selected_expense_id), None)
        if not row:
            return
        prefill = {"desc": row["description"], "amount": str(row["amount"]),
                   "category": row["category"], "date": row["date"]}
        def save(desc, amount, cat, date):
            db.update_expense(self._selected_expense_id, desc, amount, cat, date)
            self._refresh_all()
        TransactionDialog(self, "Edit Expense", save, prefill=prefill)

    def _delete_expense(self):
        if not self._selected_expense_id:
            messagebox.showinfo("No selection", "Please select a record to delete.")
            return
        if messagebox.askyesno("Confirm delete", "Delete this expense record?"):
            db.delete_expense(self._selected_expense_id)
            self._selected_expense_id = None
            self._refresh_all()

    # ─────────────────────────────────────────
    #  Goals CRUD
    # ─────────────────────────────────────────
    def _add_goal(self):
        def save(name, target, saved, deadline):
            db.add_goal(name, target, saved, deadline)
            self._refresh_goals()
        GoalDialog(self, save)

    def _delete_goal(self):
        if not self._selected_goal_id:
            messagebox.showinfo("No selection", "Please click a goal card to select it first.")
            return
        if messagebox.askyesno("Confirm delete", "Delete this goal?"):
            db.delete_goal(self._selected_goal_id)
            self._refresh_goals()


# ─────────────────────────────────────────────
#  Entry point
# ─────────────────────────────────────────────
if __name__ == "__main__":
    app = ExpenseTrackerApp()
    app.mainloop()
