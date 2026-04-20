// screens/ItemAllocationScreen.js
// ---------------------------------
// Allows users to allocate receipt items to people.
// Supports:
//   - Each person selecting their own items
//   - One person allocating items to everyone
//   - Shared items split between selected people

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Modal, FlatList, TextInput
} from 'react-native';
import { colours, globalStyles, buttonStyle } from '../utils/theme';
import { settleDebts } from '../utils/splitLogic';

export default function ItemAllocationScreen({ navigation, route }) {
  const { people, payments, items, total, tipPercent, tipAmount } = route.params;

  // Each item: { name, price, assignedTo: [], isShared: false }
  const [allocatedItems, setAllocatedItems] = useState(
    items.map((item, index) => ({
      ...item,
      id: index.toString(),
      assignedTo: [],
      isShared: false,
    }))
  );

  // Modal state for sharing an item
  const [sharingItem, setSharingItem]   = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Which person is currently allocating (for "one person allocates" mode)
  const [activeAllocator, setActiveAllocator] = useState(null);

  const btnGreen = buttonStyle(colours.accentGreen);
  const btnBlue  = buttonStyle(colours.accentBlue);

  // ── Assign item to a person ───────────────
  const toggleAssign = (itemId, personName) => {
    setAllocatedItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const already = item.assignedTo.includes(personName);
        return {
          ...item,
          assignedTo: already
            ? item.assignedTo.filter((p) => p !== personName)
            : [...item.assignedTo, personName],
          isShared: false,
        };
      })
    );
  };

  // ── Mark item as shared ───────────────────
  const openShareModal = (item) => {
    setSharingItem(item);
    setModalVisible(true);
  };

  const confirmShare = (selectedPeople) => {
    if (selectedPeople.length < 2) {
      Alert.alert('Select at least 2 people to share an item.');
      return;
    }
    setAllocatedItems((prev) =>
      prev.map((item) =>
        item.id === sharingItem.id
          ? { ...item, assignedTo: selectedPeople, isShared: true }
          : item
      )
    );
    setModalVisible(false);
    setSharingItem(null);
  };

  // ── Calculate each person's total ─────────
  const calculatePersonTotals = () => {
    const totals = {};
    people.forEach((p) => (totals[p] = 0));

    allocatedItems.forEach((item) => {
      if (item.assignedTo.length === 0) return;
      const share = parseFloat(
        (item.price / item.assignedTo.length).toFixed(2)
      );
      item.assignedTo.forEach((person) => {
        totals[person] = parseFloat((totals[person] + share).toFixed(2));
      });
    });

    // Add tip proportionally
    if (tipAmount > 0) {
      const itemTotal = allocatedItems.reduce(
        (sum, item) => sum + (item.assignedTo.length > 0 ? item.price : 0), 0
      );
      Object.keys(totals).forEach((person) => {
        if (itemTotal > 0) {
          const tipShare = parseFloat(
            ((totals[person] / itemTotal) * tipAmount).toFixed(2)
          );
          totals[person] = parseFloat((totals[person] + tipShare).toFixed(2));
        }
      });
    }

    return totals;
  };

  // ── Unallocated items ──────────────────────
  const unallocatedItems = allocatedItems.filter(
    (item) => item.assignedTo.length === 0
  );

  // ── Proceed to results ────────────────────
  const proceed = () => {
    if (unallocatedItems.length > 0) {
      Alert.alert(
        'Unallocated items',
        `${unallocatedItems.length} item(s) haven't been assigned to anyone. Continue anyway?`,
        [
          { text: 'Go back', style: 'cancel' },
          { text: 'Continue', onPress: navigateToResults },
        ]
      );
      return;
    }
    navigateToResults();
  };

  const navigateToResults = () => {
    const personTotals = calculatePersonTotals();

    const splitResult = people.map((name) => ({
      name,
      amount: personTotals[name] || 0,
    }));

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
      subtotal: total - (tipAmount || 0),
      tipPercent: tipPercent || 0,
      tipAmount:  tipAmount || 0,
      payments,
      method: 'Item Allocation',
    });
  };

  // ── Render ────────────────────────────────
  return (
    <ScrollView style={globalStyles.screen}>
      <Text style={globalStyles.title}>Allocate Items</Text>
      <Text style={globalStyles.subtitle}>
        Assign each item to the person(s) who ordered it.
      </Text>

      {/* Allocator selector */}
      <View style={globalStyles.card}>
        <Text style={styles.sectionLabel}>
          📌 Allocating as:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.personRow}>
            <TouchableOpacity
              style={[
                styles.personChip,
                activeAllocator === null && styles.personChipActive,
              ]}
              onPress={() => setActiveAllocator(null)}
            >
              <Text style={[
                styles.personChipText,
                activeAllocator === null && styles.personChipTextActive,
              ]}>
                Everyone
              </Text>
            </TouchableOpacity>
            {people.map((person) => (
              <TouchableOpacity
                key={person}
                style={[
                  styles.personChip,
                  activeAllocator === person && styles.personChipActive,
                ]}
                onPress={() => setActiveAllocator(person)}
              >
                <Text style={[
                  styles.personChipText,
                  activeAllocator === person && styles.personChipTextActive,
                ]}>
                  {person}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={styles.allocatorHint}>
          {activeAllocator
            ? `Tap items to assign them to ${activeAllocator}`
            : 'Tap names on each item to assign them'}
        </Text>
      </View>

      {/* Unallocated warning */}
      {unallocatedItems.length > 0 && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            ⚠️ {unallocatedItems.length} item(s) not yet assigned
          </Text>
        </View>
      )}

      {/* Items list */}
      {allocatedItems.map((item) => (
        <View key={item.id} style={[
          globalStyles.card,
          item.assignedTo.length > 0 && styles.itemAssigned,
        ]}>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
          </View>

          {/* Assignment status */}
          {item.assignedTo.length > 0 && (
            <Text style={styles.assignedTo}>
              {item.isShared ? '🤝 Shared: ' : '👤 '}
              {item.assignedTo.join(', ')}
              {item.isShared && item.assignedTo.length > 1
                ? ` (R ${(item.price / item.assignedTo.length).toFixed(2)} each)`
                : ''}
            </Text>
          )}

          {/* Action buttons */}
          <View style={styles.itemActions}>
            {/* In "everyone" mode — show all people as toggles */}
            {activeAllocator === null ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.personRow}>
                    {people.map((person) => (
                      <TouchableOpacity
                        key={person}
                        style={[
                          styles.assignChip,
                          item.assignedTo.includes(person) &&
                            styles.assignChipActive,
                        ]}
                        onPress={() => toggleAssign(item.id, person)}
                      >
                        <Text style={[
                          styles.assignChipText,
                          item.assignedTo.includes(person) &&
                            styles.assignChipTextActive,
                        ]}>
                          {person}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => openShareModal(item)}
                >
                  <Text style={styles.shareBtnText}>🤝 Share</Text>
                </TouchableOpacity>
              </>
            ) : (
              // In single-allocator mode — one tap assigns to active person
              <TouchableOpacity
                style={[
                  styles.assignBtn,
                  item.assignedTo.includes(activeAllocator) &&
                    styles.assignBtnActive,
                ]}
                onPress={() => toggleAssign(item.id, activeAllocator)}
              >
                <Text style={styles.assignBtnText}>
                  {item.assignedTo.includes(activeAllocator)
                    ? '✓ Mine'
                    : '+ Add to my order'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {/* Proceed button */}
      <TouchableOpacity
        style={[btnGreen.btn, { marginBottom: 40 }]}
        onPress={proceed}
        activeOpacity={0.85}
      >
        <Text style={btnGreen.btnText}>Calculate →</Text>
      </TouchableOpacity>

      {/* Share modal */}
      <ShareModal
        visible={modalVisible}
        item={sharingItem}
        people={people}
        onConfirm={confirmShare}
        onCancel={() => { setModalVisible(false); setSharingItem(null); }}
      />
    </ScrollView>
  );
}

// ── Share Modal ───────────────────────────────
function ShareModal({ visible, item, people, onConfirm, onCancel }) {
  const [selected, setSelected] = useState([]);

  const toggle = (person) => {
    setSelected((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            Who's sharing "{item?.name}"?
          </Text>
          <Text style={styles.modalSubtitle}>
            R {item?.price.toFixed(2)} will be split equally
          </Text>

          {people?.map((person) => (
            <TouchableOpacity
              key={person}
              style={[
                styles.modalPersonRow,
                selected.includes(person) && styles.modalPersonRowActive,
              ]}
              onPress={() => toggle(person)}
            >
              <Text style={styles.modalPersonName}>{person}</Text>
              {selected.includes(person) && (
                <Text style={styles.modalCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => { setSelected([]); onCancel(); }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalConfirm}
              onPress={() => { onConfirm(selected); setSelected([]); }}
            >
              <Text style={styles.modalConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: colours.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  personRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'nowrap',
  },
  personChip: {
    backgroundColor: colours.bgPanel,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personChipActive: {
    borderColor: colours.accentGreen,
    backgroundColor: colours.bgCard,
  },
  personChipText: {
    color: colours.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  personChipTextActive: {
    color: colours.accentGreen,
  },
  allocatorHint: {
    color: colours.textMuted,
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  warningCard: {
    backgroundColor: '#3d2a1e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colours.accentGold,
  },
  warningText: {
    color: colours.accentGold,
    fontSize: 13,
    fontWeight: '600',
  },
  itemAssigned: {
    borderLeftWidth: 3,
    borderLeftColor: colours.accentGreen,
  },
  itemName: {
    color: colours.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    color: colours.accentGreen,
    fontSize: 15,
    fontWeight: 'bold',
  },
  assignedTo: {
    color: colours.textMuted,
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemActions: {
    marginTop: 10,
    gap: 8,
  },
  assignChip: {
    backgroundColor: colours.bgPanel,
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colours.bgCard,
  },
  assignChipActive: {
    backgroundColor: colours.accentGreen,
    borderColor: colours.accentGreen,
  },
  assignChipText: {
    color: colours.textMuted,
    fontSize: 12,
  },
  assignChipTextActive: {
    color: colours.bgDark,
    fontWeight: 'bold',
  },
  shareBtn: {
    backgroundColor: colours.bgPanel,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  shareBtnText: {
    color: colours.accentGold,
    fontSize: 12,
    fontWeight: '600',
  },
  assignBtn: {
    backgroundColor: colours.bgPanel,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colours.bgCard,
  },
  assignBtnActive: {
    backgroundColor: colours.accentGreen,
    borderColor: colours.accentGreen,
  },
  assignBtnText: {
    color: colours.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colours.bgPanel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: colours.textPrimary,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: colours.textMuted,
    fontSize: 13,
    marginBottom: 16,
  },
  modalPersonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: colours.bgCard,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalPersonRowActive: {
    borderColor: colours.accentGreen,
  },
  modalPersonName: {
    color: colours.textPrimary,
    fontSize: 15,
  },
  modalCheck: {
    color: colours.accentGreen,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: colours.bgCard,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colours.textMuted,
    fontWeight: '600',
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: colours.accentGreen,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: colours.bgDark,
    fontWeight: 'bold',
  },
});