// utils/theme.js
// ---------------
// Shared colour palette, typography, and reusable styles
// used consistently across all screens.

import { StyleSheet } from 'react-native';

export const colours = {
  bgDark:       '#1e1e2e',
  bgPanel:      '#2a2a3e',
  bgCard:       '#313145',
  accentGreen:  '#4ecca3',
  accentRed:    '#e06c75',
  accentBlue:   '#61afef',
  accentGold:   '#e5c07b',
  textPrimary:  '#cdd6f4',
  textMuted:    '#6c7086',
  white:        '#ffffff',
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.bgDark,
    padding: 16,
  },
  card: {
    backgroundColor: colours.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colours.accentGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colours.textMuted,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colours.textMuted,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: colours.bgPanel,
    color: colours.textPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colours.bgCard,
  },
  inputFocused: {
    borderColor: colours.accentGreen,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colours.bgPanel,
    marginVertical: 12,
  },
  errorText: {
    color: colours.accentRed,
    fontSize: 13,
    marginTop: 4,
  },
});

// Reusable button style generator
export const buttonStyle = (colour = colours.accentGreen) =>
  StyleSheet.create({
    btn: {
      backgroundColor: colour,
      borderRadius: 10,
      paddingVertical: 13,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginTop: 8,
    },
    btnText: {
      color: colours.bgDark,
      fontWeight: 'bold',
      fontSize: 15,
    },
  });
