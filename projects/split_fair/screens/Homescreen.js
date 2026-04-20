// screens/HomeScreen.js
// ----------------------
// Landing screen for Split Fair.
// Entry point for starting a new bill split.

import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image
} from 'react-native';
import { colours, globalStyles, buttonStyle } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const btn = buttonStyle(colours.accentGreen);

  return (
    <View style={globalStyles.screen}>

      {/* Hero section */}
      <View style={styles.hero}>
        <Text style={styles.emoji}>💸</Text>
        <Text style={styles.heroTitle}>Split Fair</Text>
        <Text style={styles.heroSub}>
          Split any bill fairly — equally or by custom amounts.{'\n'}
          Scan a receipt, add your group, and settle up in seconds.
        </Text>
      </View>

      {/* Feature cards */}
      <View style={globalStyles.card}>
        <Text style={styles.featureIcon}>📷</Text>
        <Text style={styles.featureTitle}>Scan a Receipt</Text>
        <Text style={styles.featureDesc}>
          Use your camera to scan a receipt and auto-fill the total.
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.featureIcon}>🤝</Text>
        <Text style={styles.featureTitle}>Split Your Way</Text>
        <Text style={styles.featureDesc}>
          Equal, custom percentages, or fixed amounts — your choice.
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.featureIcon}>✅</Text>
        <Text style={styles.featureTitle}>Settle Up Instantly</Text>
        <Text style={styles.featureDesc}>
          See exactly who owes what with the minimum transactions needed.
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={btn.btn}
        onPress={() => navigation.navigate('AddPeople')}
        activeOpacity={0.85}
      >
        <Text style={btn.btnText}>Start Splitting →</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colours.accentGreen,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  featureIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colours.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: colours.textMuted,
  },
});
