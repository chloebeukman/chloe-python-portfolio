# 💸 Split Fair

A React Native mobile app for splitting bills fairly — equally or by custom amounts — with receipt scanning via OCR.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

- **Receipt scanning** — use your camera to scan a receipt; OCR auto-detects the total
- **Equal splits** — divide any bill evenly across the group
- **Custom percentage splits** — assign different percentages to each person
- **Fixed amount splits** — specify exactly how much each person pays
- **Tip calculator** — add a tip percentage before splitting
- **Multiple payers** — handles situations where more than one person paid upfront
- **Settle up** — calculates the minimum transactions needed to balance the group
- **Share results** — send the breakdown to your group via any messaging app

---

## 📱 Screenshots

<img width="263" height="533" alt="WhatsApp Image 2026-04-21 at 02 34 29" src="https://github.com/user-attachments/assets/2b8f0e27-a44d-4a8a-aa8d-a4ab5da18b8f" />

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | React Native + Expo               |
| Language      | JavaScript (ES6+)                 |
| Navigation    | React Navigation (Native Stack)   |
| Camera / OCR  | expo-camera + Receipt OCR API     |
| OCR Backend   | [receipt-ocr-api](https://github.com/chloebeukman/receipt-ocr-api) (Vercel) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Clone the repository
git clone https://github.com/chloebeukman/split-fair.git
cd split-fair

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android).

---

## 📁 Project Structure

```
split_fair/
├── App.js                        # Navigation setup
├── package.json
├── screens/
│   ├── HomeScreen.js             # Landing screen
│   ├── AddPeopleScreen.js        # Add group members & record payments
│   ├── ScanReceiptScreen.js      # Camera + OCR integration
│   ├── SplitScreen.js            # Choose split method
│   └── ResultsScreen.js          # Final breakdown & settle up
└── utils/
    ├── splitLogic.js             # All calculation logic (pure functions)
    └── theme.js                  # Shared colours, fonts & styles
```

---

## 🔗 Related Project

This app connects to the **Receipt OCR API** — a companion REST API that extracts totals from receipt images using OCR.

[View Receipt OCR API →](https://github.com/chloebeukman/receipt-ocr-api)

---

## 💡 What I Learned

- Building multi-screen mobile apps with React Navigation
- Integrating device hardware (camera) via Expo
- Consuming a REST API from a mobile client
- Writing pure utility functions with clear separation from UI logic
- Handling edge cases in financial calculations (rounding, validation)
- Designing for mobile UX — input flow, feedback, and error handling

---

## 👩‍💻 Author

**Chloe Beukman** · [GitHub](https://github.com/chloebeukman) · [LinkedIn](https://www.linkedin.com/in/chloe-beukman)
