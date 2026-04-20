// screens/SplitScreen.js
// -----------------------
// Allows users to choose how to split the bill:
//   - Equally
//   - By custom percentage
//   - By fixed amount

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert
} from 'react-native';
import {
  splitEqually,
  splitByPercentage,
  splitByFixedAmount,
  settleDebts,
} from '../utils/splitLogic';
import { colours, globalStyles, buttonStyle } from '../utils/theme';

const METHODS = ['Equal', 'Percentage', 'Fixed Amount'];

export default function SplitScreen({ navigation, route }) {
  const { people, payments, subtotal, tipPercent, tipAmount, total } = route.params;

  const [method, setMethod]   = useState('Equal');
  const [shares, setShares]   = useState(() =>
    people.map((name) => ({ name, value: '' }))
  );

  const btnGreen = buttonStyle(colours.accentGreen);

  // ── Update a share value ──────────────────
  const updateShare = (index, value) => {
    const updated = [...shares];
    updated[index] = { ...updated[index], value };
    setShares(updated);
  };

  // ── Validation helpers ────────────────────
  const validatePercentages = () => {
    const sum = shares.reduce((acc, s) => acc + (parseFloat(s.value) || 0), 0);
    return Math.abs(sum - 100) < 0.01;
  };

  const validateFixed = () => {
    const sum = shares.reduce((acc, s) => acc + (parseFloat(s.value) || 0), 0);
    return Math.abs(sum - total) < 0.01;
  };

  // ── Calculate and proceed ─────────────────
  const calculate = () => {
    try {
      let splitResult;

      if (method === 'Equal') {
        splitResult = splitEqually(total, people);

      } else if (method === 'Percentage') {
        if (!validatePercentages()) {
          const sum = shares.reduce((a, s) => a + (parseFloat(s.value) || 0), 0);
          Alert.alert(
            'Percentages don\'t add up',
            `They currently sum to ${sum.toFixed(1)}%. They must total 100%.`
          );
          return;
        }
        splitResult = splitByPercentage(
          total,
          shares.map((s) => ({ name: s.name, percent: parseFloat(s.value) }))
        );

      } else {
        if (!validateFixed()) {
          const sum = shares.reduce((a, s) => a + (parseFloat(s.value) || 0), 0);
          Alert.alert(
            'Amounts don\'t match total',
            `They currently sum to R ${sum.toFixed(2)} but the total is R ${total.toFixed(2)}.`
          );
          return;
        }
        splitResult = splitByFixedAmount(
          total,
          shares.map((s) => ({ name: s.name, amount: parseFloat(s.value) }))
        );
      }

      // Build ledger: who paid vs who owes
      const ledger = splitResult.map((entry) => ({
        name:  entry.name,
        paid:  payments[entry.name] || 0,
        owes:  entry.amount,
      }));

      const transactions = settleDebts(ledger);

      navigation.navigate('Results', {
        splitResult,
        transactions,
        total,
        subtotal,
        tipPercent,
        tipAmount,
        payments,
        method,
      });

    } catch (error) {
      Alert.alert('Calculation error', error.message);
    }
  };

  // ── Running total for validation feedback ─
  const runningSum = shares.reduce((a, s) => a + (parseFloat(s.value) || 0), 0);

  const validationText = () => {
    if (method === 'Percentage') {
      const diff = 100 - runningSum;
      if (Math.abs(diff) < 0.01) return { text: '✓ Percentages add up to 100%', ok: true };
      return {
        text: diff > 0
          ? `${diff.toFixed(1)}% remaining to assign`
          : `${Math.abs(diff).toFixed(1)}% over — reduce someone's share`,
        ok: false,
      };
    }
    if (method === 'Fixed Amount') {
      const diff = total - runningSum;
      if (Math.abs(diff) < 0.01) return { text: `✓ Amounts add up to R ${total.toFixed(2)}`, ok: true };
      return {
        text: diff > 0
          ? `R ${diff.toFixed(2)} remaining to assign`
          : `R ${Math.abs(diff).toFixed(2)} over the total`,
        ok: false,
      };
    }
    return null;
  };

  const validation = validationText();

  return (
    <ScrollView style={globalStyles.screen}>

      {/* Total summary */}
      <View style={[globalStyles.card, styles.totalCard]}>
        <Text style={styles.totalCardLabel}>Splitting</Text>
        <Text style={styles.totalCardAmount}>R {total.toFixed(2)}</Text>
        {tipAmount > 0 && (
          <Text style={styles.totalCardSub}>
            Includes R {tipAmount.toFixed(2)} tip ({tipPercent}%)
          </Text>
        )}
        <Text style={styles.totalCardSub}>
          between {people.length} people
        </Text>
      </View>

      {/* Split method selector */}
      <Text style={globalStyles.label}>Split method</Text>
      <View style={styles.methodRow}>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.methodBtn, method === m && styles.methodBtnActive]}
            onPress={() => setMethod(m)}
          >
            <Text style={[
              styles.methodBtnText,
              method === m && styles.methodBtnTextActive
            ]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Equal split — just show the preview */}
      {method === 'Equal' && (
        <View style={globalStyles.card}>
          {people.map((name) => (
            <View key={name} style={[globalStyles.spaceBetween, styles.shareRow]}>
              <Text style={styles.shareName}>{name}</Text>
              <Text style={styles.shareAmount}>
                R {(total / people.length).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Percentage / Fixed amount inputs */}
      {method !== 'Equal' && (
        <>
          <Text style={globalStyles.label}>
            {method === 'Percentage'
              ? 'Enter each person\'s percentage share:'
              : 'Enter each person\'s fixed amount (R):'}
          </Text>

          {shares.map((share, index) => (
            <View key={share.name} style={styles.shareInputRow}>
              <Text style={styles.shareInputName}>{share.name}</Text>
              <View style={styles.shareInputWrapper}>
                {method === 'Fixed Amount' && (
                  <Text style={styles.rSymbol}>R</Text>
                )}
                <TextInput
                  style={[globalStyles.input, styles.shareInput]}
                  placeholder={method === 'Percentage' ? '0' : '0.00'}
                  placeholderTextColor={colours.textMuted}
                  keyboardType="decimal-pad"
                  value={share.value}
                  onChangeText={(val) => updateShare(index, val)}
                />
                {method === 'Percentage' && (
                  <Text style={styles.pctSymbol}>%</Text>
                )}
              </View>
            </View>
          ))}

          {/* Validation feedback */}
          {validation && (
            <Text style={[
              styles.validationText,
              { color: validation.ok ? colours.accentGreen : colours.accentGold }
            ]}>
              {validation.text}
            </Text>
          )}
        </>
      )}

      <TouchableOpacity
        style={[btnGreen.btn, { marginTop: 20, marginBottom: 40 }]}
        onPress={calculate}
        activeOpacity={0.85}
      >
        <Text style={btnGreen.btnText}>Calculate →</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  totalCard: {
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: colours.accentGreen,
    marginBottom: 16,
  },
  totalCardLabel:  { color: colours.textMuted, fontSize: 13 },
  totalCardAmount: { color: colours.accentGreen, fontSize: 32, fontWeight: 'bold' },
  totalCardSub:    { color: colours.textMuted, fontSize: 13, marginTop: 2 },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  methodBtn: {
    flex: 1,
    backgroundColor: colours.bgCard,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodBtnActive: {
    borderColor: colours.accentGreen,
    backgroundColor: colours.bgPanel,
  },
  methodBtnText: {
    color: colours.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  methodBtnTextActive: {
    color: colours.accentGreen,
  },
  shareRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colours.bgPanel,
  },
  shareName:   { color: colours.textPrimary, fontSize: 15 },
  shareAmount: { color: colours.accentGreen, fontSize: 15, fontWeight: 'bold' },
  shareInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shareInputName: {
    color: colours.textPrimary,
    fontSize: 15,
    flex: 1,
  },
  shareInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shareInput: { width: 100, textAlign: 'right' },
  rSymbol:    { color: colours.textMuted, fontSize: 15 },
  pctSymbol:  { color: colours.textMuted, fontSize: 15 },
  validationText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
});
