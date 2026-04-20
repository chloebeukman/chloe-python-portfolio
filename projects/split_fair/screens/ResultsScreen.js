// screens/ResultsScreen.js
// -------------------------
// Final screen showing:
//   - Each person's share of the bill
//   - The minimum transactions needed to settle up
//   - A summary of the bill details

import React from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet, Share
} from 'react-native';
import { colours, globalStyles, buttonStyle } from '../utils/theme';

export default function ResultsScreen({ navigation, route }) {
  const {
    splitResult, transactions, total,
    subtotal, tipPercent, tipAmount,
    payments, method,
  } = route.params;

  const btnGreen = buttonStyle(colours.accentGreen);
  const btnBlue  = buttonStyle(colours.accentBlue);

  // ── Share results as text ─────────────────
  const shareResults = async () => {
    const lines = [
      '💸 Split Fair Results',
      '─────────────────────',
      `Total: R ${total.toFixed(2)}`,
      tipAmount > 0 ? `Tip (${tipPercent}%): R ${tipAmount.toFixed(2)}` : null,
      '',
      '📋 Each person owes:',
      ...splitResult.map((s) => `  ${s.name}: R ${s.amount.toFixed(2)}`),
      '',
      '✅ Settle up:',
      ...transactions.map((t) => `  ${t.from} → ${t.to}: R ${t.amount.toFixed(2)}`),
      transactions.length === 0 ? '  Everyone is settled! 🎉' : null,
    ]
      .filter(Boolean)
      .join('\n');

    await Share.share({ message: lines });
  };

  return (
    <ScrollView style={globalStyles.screen}>

      {/* Bill summary */}
      <View style={[globalStyles.card, styles.summaryCard]}>
        <Text style={globalStyles.title}>All settled! 🎉</Text>
        <View style={globalStyles.spaceBetween}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>R {subtotal.toFixed(2)}</Text>
        </View>
        {tipAmount > 0 && (
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.summaryLabel}>Tip ({tipPercent}%)</Text>
            <Text style={styles.summaryValue}>R {tipAmount.toFixed(2)}</Text>
          </View>
        )}
        <View style={globalStyles.divider} />
        <View style={globalStyles.spaceBetween}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R {total.toFixed(2)}</Text>
        </View>
        <Text style={styles.methodBadge}>Split method: {method}</Text>
      </View>

      {/* Each person's share */}
      <Text style={styles.sectionTitle}>📋 Each person's share</Text>
      <View style={globalStyles.card}>
        {splitResult.map((entry, index) => {
          const paid = payments[entry.name] || 0;
          const net  = paid - entry.amount;
          return (
            <View
              key={entry.name}
              style={[
                styles.shareRow,
                index < splitResult.length - 1 && styles.shareRowBorder,
              ]}
            >
              <View>
                <Text style={styles.shareName}>{entry.name}</Text>
                {paid > 0 && (
                  <Text style={styles.paidNote}>Paid R {paid.toFixed(2)}</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.shareAmount}>R {entry.amount.toFixed(2)}</Text>
                {entry.percent !== undefined && (
                  <Text style={styles.pctNote}>{entry.percent}%</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Settle up transactions */}
      <Text style={styles.sectionTitle}>✅ Settle up</Text>
      <View style={globalStyles.card}>
        {transactions.length === 0 ? (
          <Text style={styles.settledText}>
            Everyone already paid their share — nothing to settle! 🎉
          </Text>
        ) : (
          transactions.map((t, index) => (
            <View
              key={index}
              style={[
                styles.transactionRow,
                index < transactions.length - 1 && styles.shareRowBorder,
              ]}
            >
              <View style={globalStyles.row}>
                <Text style={styles.transactionFrom}>{t.from}</Text>
                <Text style={styles.arrow}> → </Text>
                <Text style={styles.transactionTo}>{t.to}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                R {t.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Action buttons */}
      <TouchableOpacity
        style={btnBlue.btn}
        onPress={shareResults}
        activeOpacity={0.85}
      >
        <Text style={btnBlue.btnText}>📤 Share Results</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[btnGreen.btn, { marginBottom: 40 }]}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.85}
      >
        <Text style={btnGreen.btnText}>Start a New Split</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderLeftWidth: 3,
    borderLeftColor: colours.accentGreen,
    marginBottom: 16,
  },
  summaryLabel: { color: colours.textMuted, fontSize: 14 },
  summaryValue: { color: colours.textPrimary, fontSize: 14 },
  totalLabel:   { color: colours.textPrimary, fontWeight: 'bold', fontSize: 16 },
  totalValue:   { color: colours.accentGreen, fontWeight: 'bold', fontSize: 20 },
  methodBadge: {
    marginTop: 8,
    color: colours.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  sectionTitle: {
    color: colours.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  shareRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colours.bgPanel,
  },
  shareName:    { color: colours.textPrimary, fontSize: 15, fontWeight: '600' },
  paidNote:     { color: colours.textMuted, fontSize: 12, marginTop: 2 },
  shareAmount:  { color: colours.accentGreen, fontSize: 16, fontWeight: 'bold' },
  pctNote:      { color: colours.textMuted, fontSize: 12 },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  transactionFrom:   { color: colours.accentRed, fontWeight: '600', fontSize: 15 },
  arrow:             { color: colours.textMuted, fontSize: 15 },
  transactionTo:     { color: colours.accentGreen, fontWeight: '600', fontSize: 15 },
  transactionAmount: { color: colours.accentGold, fontWeight: 'bold', fontSize: 15 },
  settledText:       { color: colours.accentGreen, fontSize: 15, textAlign: 'center', padding: 8 },
});
