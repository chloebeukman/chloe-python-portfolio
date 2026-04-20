// screens/AddPeopleScreen.js
// ---------------------------
// Screen for adding the people in the group and
// specifying who paid (can be multiple payers).

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, Alert
} from 'react-native';
import { colours, globalStyles, buttonStyle } from '../utils/theme';

export default function AddPeopleScreen({ navigation }) {
  const [nameInput, setNameInput]   = useState('');
  const [people, setPeople]         = useState([]);
  const [paidInput, setPaidInput]   = useState('');
  const [selectedPayer, setSelectedPayer] = useState(null);
  const [payments, setPayments]     = useState({}); // { name: amount }

  const btnGreen = buttonStyle(colours.accentGreen);
  const btnBlue  = buttonStyle(colours.accentBlue);

  // ── Add a person ──────────────────────────
  const addPerson = () => {
    const name = nameInput.trim();
    if (!name) return;
    if (people.includes(name)) {
      Alert.alert('Duplicate', `${name} is already in the group.`);
      return;
    }
    setPeople([...people, name]);
    setNameInput('');
  };

  // ── Remove a person ───────────────────────
  const removePerson = (name) => {
    setPeople(people.filter((p) => p !== name));
    const updated = { ...payments };
    delete updated[name];
    setPayments(updated);
    if (selectedPayer === name) setSelectedPayer(null);
  };

  // ── Record a payment ──────────────────────
  const recordPayment = () => {
    if (!selectedPayer) {
      Alert.alert('No payer selected', 'Tap a name to select who paid.');
      return;
    }
    const amount = parseFloat(paidInput);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid payment amount.');
      return;
    }
    setPayments({ ...payments, [selectedPayer]: amount });
    setPaidInput('');
    setSelectedPayer(null);
  };

  // ── Proceed to next screen ─────────────────
  const proceed = () => {
    if (people.length < 2) {
      Alert.alert('Too few people', 'Add at least 2 people to split a bill.');
      return;
    }
    navigation.navigate('ScanReceipt', { people, payments });
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Who's splitting?</Text>
      <Text style={globalStyles.subtitle}>
        Add everyone in the group, then record who paid.
      </Text>

      {/* Add person input */}
      <View style={styles.inputRow}>
        <TextInput
          style={[globalStyles.input, styles.flex]}
          placeholder="Enter a name..."
          placeholderTextColor={colours.textMuted}
          value={nameInput}
          onChangeText={setNameInput}
          onSubmitEditing={addPerson}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addPerson}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* People list */}
      {people.length > 0 && (
        <>
          <Text style={globalStyles.label}>
            Tap a name to mark as payer, then enter how much they paid:
          </Text>

          <FlatList
            data={people}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.personCard,
                  selectedPayer === item && styles.personCardSelected,
                ]}
                onPress={() => setSelectedPayer(item)}
              >
                <View style={globalStyles.spaceBetween}>
                  <Text style={styles.personName}>{item}</Text>
                  <View style={globalStyles.row}>
                    {payments[item] !== undefined && (
                      <Text style={styles.paidBadge}>
                        Paid R {payments[item].toFixed(2)}
                      </Text>
                    )}
                    <TouchableOpacity onPress={() => removePerson(item)}>
                      <Text style={styles.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Payment input */}
          {selectedPayer && (
            <View style={styles.paymentRow}>
              <Text style={styles.payerLabel}>
                How much did {selectedPayer} pay?
              </Text>
              <View style={styles.inputRow}>
                <Text style={styles.rSymbol}>R</Text>
                <TextInput
                  style={[globalStyles.input, styles.flex]}
                  placeholder="0.00"
                  placeholderTextColor={colours.textMuted}
                  keyboardType="decimal-pad"
                  value={paidInput}
                  onChangeText={setPaidInput}
                />
                <TouchableOpacity style={styles.addBtn} onPress={recordPayment}>
                  <Text style={styles.addBtnText}>✓ Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}

      {/* Next button */}
      {people.length >= 2 && (
        <TouchableOpacity
          style={[btnGreen.btn, { marginTop: 20 }]}
          onPress={proceed}
          activeOpacity={0.85}
        >
          <Text style={btnGreen.btnText}>Next: Scan or Enter Total →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  flex: { flex: 1 },
  addBtn: {
    backgroundColor: colours.accentBlue,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  addBtnText: {
    color: colours.bgDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
  personCard: {
    backgroundColor: colours.bgCard,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personCardSelected: {
    borderColor: colours.accentGreen,
  },
  personName: {
    color: colours.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  paidBadge: {
    color: colours.accentGreen,
    fontSize: 12,
    marginRight: 10,
    fontWeight: 'bold',
  },
  removeBtn: {
    color: colours.accentRed,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  paymentRow: {
    backgroundColor: colours.bgPanel,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  payerLabel: {
    color: colours.accentGold,
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  rSymbol: {
    color: colours.textPrimary,
    fontSize: 16,
    marginRight: 4,
  },
});
