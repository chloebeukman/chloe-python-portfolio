// utils/splitLogic.js
// --------------------
// Core calculation engine for Split Fair.
// All splitting logic lives here, completely separate from the UI.
//
// Supports:
//   - Equal splits
//   - Unequal / custom splits (by percentage or fixed amount)
//   - Tip calculation
//   - Multiple payers — calculates the minimum transactions to settle up

/**
 * Calculate tip amount from a subtotal and tip percentage.
 */
export function calculateTip(subtotal, tipPercent) {
  return parseFloat((subtotal * (tipPercent / 100)).toFixed(2));
}

/**
 * Calculate the grand total (subtotal + tip).
 */
export function calculateTotal(subtotal, tipAmount) {
  return parseFloat((subtotal + tipAmount).toFixed(2));
}

/**
 * Split a total equally among a list of people.
 *
 * @param {number} total - Grand total to split
 * @param {string[]} people - Array of names
 * @returns {Object[]} Array of { name, amount } objects
 */
export function splitEqually(total, people) {
  if (!people.length) return [];
  const share = parseFloat((total / people.length).toFixed(2));

  // Handle rounding remainder — give it to the first person
  const remainder = parseFloat(
    (total - share * people.length).toFixed(2)
  );

  return people.map((name, index) => ({
    name,
    amount: index === 0 ? parseFloat((share + remainder).toFixed(2)) : share,
  }));
}

/**
 * Split a total by custom percentages.
 * Percentages must sum to 100.
 *
 * @param {number} total
 * @param {{ name: string, percent: number }[]} shares
 * @returns {Object[]} Array of { name, amount, percent }
 */
export function splitByPercentage(total, shares) {
  const totalPct = shares.reduce((sum, s) => sum + s.percent, 0);
  if (Math.abs(totalPct - 100) > 0.01) {
    throw new Error(`Percentages must add up to 100 (currently ${totalPct.toFixed(1)})`);
  }

  return shares.map((s) => ({
    name: s.name,
    percent: s.percent,
    amount: parseFloat((total * (s.percent / 100)).toFixed(2)),
  }));
}

/**
 * Split a total by fixed custom amounts.
 * Amounts must sum to the total.
 *
 * @param {number} total
 * @param {{ name: string, amount: number }[]} shares
 * @returns {Object[]} Array of { name, amount }
 */
export function splitByFixedAmount(total, shares) {
  const sum = shares.reduce((acc, s) => acc + s.amount, 0);
  if (Math.abs(sum - total) > 0.01) {
    throw new Error(
      `Fixed amounts (R ${sum.toFixed(2)}) don't match the total (R ${total.toFixed(2)})`
    );
  }
  return shares.map((s) => ({
    name: s.name,
    amount: parseFloat(s.amount.toFixed(2)),
  }));
}

/**
 * Calculate who owes whom using the minimum number of transactions.
 *
 * @param {{ name: string, paid: number, owes: number }[]} ledger
 *   Each entry says how much a person paid and how much they owe.
 * @returns {{ from: string, to: string, amount: number }[]}
 */
export function settleDebts(ledger) {
  // Net balance: positive = owed money, negative = owes money
  const balances = ledger.map((entry) => ({
    name: entry.name,
    balance: parseFloat((entry.paid - entry.owes).toFixed(2)),
  }));

  const creditors = balances.filter((b) => b.balance > 0);
  const debtors   = balances.filter((b) => b.balance < 0);
  const transactions = [];

  // Greedy settlement algorithm
  let i = 0; // creditor index
  let j = 0; // debtor index

  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i].balance;
    const debt   = Math.abs(debtors[j].balance);
    const amount = Math.min(credit, debt);

    if (amount > 0.009) {
      transactions.push({
        from:   debtors[j].name,
        to:     creditors[i].name,
        amount: parseFloat(amount.toFixed(2)),
      });
    }

    creditors[i].balance = parseFloat((credit - amount).toFixed(2));
    debtors[j].balance   = parseFloat((debtors[j].balance + amount).toFixed(2));

    if (creditors[i].balance < 0.01) i++;
    if (Math.abs(debtors[j].balance) < 0.01) j++;
  }

  return transactions;
}
