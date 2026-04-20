// screens/ScanReceiptScreen.js
// -----------------------------
// Allows users to scan a receipt using the device camera.
// Sends the image to the receipt-ocr-api on Vercel for text extraction,
// parsing both individual items and the total from the response.
// Users can proceed to item allocation or manual splitting.

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colours, globalStyles, buttonStyle } from '../utils/theme';

const OCR_API_URL = 'https://receipt-ocr-api-sage.vercel.app/api/scan-receipt';

export default function ScanReceiptScreen({ navigation, route }) {
  const { people, payments } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen]     = useState(false);
  const [scanning, setScanning]         = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [manualTotal, setManualTotal]   = useState('');
  const [tipPercent, setTipPercent]     = useState('0');
  const [scanComplete, setScanComplete] = useState(false);
  const cameraRef = useRef(null);

  const btnGreen  = buttonStyle(colours.accentGreen);
  const btnBlue   = buttonStyle(colours.accentBlue);
  const btnGold   = buttonStyle(colours.accentGold);

  // ── Open camera ───────────────────────────
  const openCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera permission required',
          'Please allow camera access in your device settings to scan receipts.'
        );
        return;
      }
    }
    setCameraOpen(true);
  };

  // ── Capture and scan ──────────────────────
  const captureAndScan = async () => {
    if (!cameraRef.current) return;
    setScanning(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      const response = await fetch(OCR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photo.base64 }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setCameraOpen(false);
      setScanComplete(true);

      // Use parsed items if available
      if (data.items && data.items.length > 0) {
        setScannedItems(data.items);
        if (data.total) {
          setManualTotal(data.total.toString());
        }
        Alert.alert(
          'Receipt scanned! 🎉',
          `Found ${data.items.length} items. Review them below then allocate to your group.`
        );
      } else if (data.total) {
        setManualTotal(data.total.toString());
        Alert.alert(
          'Total detected!',
          `We found R ${data.total.toFixed(2)} but couldn't parse individual items. You can split manually.`
        );
      } else {
        Alert.alert(
          'Could not parse receipt',
          'Please enter the total manually and use a split method below.'
        );
      }
    } catch (error) {
      Alert.alert('Scan failed', `${error.message}\n\nPlease enter the total manually.`);
      setCameraOpen(false);
    } finally {
      setScanning(false);
    }
  };

  // ── Calculate total with tip ──────────────
  const getTotal = () => {
    const subtotal = parseFloat(manualTotal) || 0;
    const tip      = parseFloat(tipPercent) || 0;
    const tipAmt   = parseFloat((subtotal * (tip / 100)).toFixed(2));
    return {
      subtotal,
      tipPercent: tip,
      tipAmount: tipAmt,
      total: parseFloat((subtotal + tipAmt).toFixed(2)),
    };
  };

  // ── Proceed to item allocation ────────────
  const proceedToItemAllocation = () => {
    if (scannedItems.length === 0) {
      Alert.alert('No items', 'Please scan a receipt first to use item allocation.');
      return;
    }
    const { subtotal, tipPercent: tip, tipAmount, total } = getTotal();
    navigation.navigate('ItemAllocation', {
      people,
      payments,
      items: scannedItems,
      subtotal,
      tipPercent: tip,
      tipAmount,
      total,
    });
  };

  // ── Proceed to manual split ───────────────
  const proceedToManualSplit = () => {
    const subtotal = parseFloat(manualTotal);
    if (isNaN(subtotal) || subtotal <= 0) {
      Alert.alert('Invalid total', 'Please enter a valid bill total.');
      return;
    }
    const { tipPercent: tip, tipAmount, total } = getTotal();
    navigation.navigate('Split', {
      people,
      payments,
      subtotal,
      tipPercent: tip,
      tipAmount,
      total,
    });
  };

  // ── Camera view ───────────────────────────
  if (cameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={styles.receiptFrame} />
            <Text style={styles.cameraHint}>
              Align the receipt within the frame
            </Text>
            {scanning ? (
              <ActivityIndicator size="large" color={colours.accentGreen} style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.cameraButtons}>
                <TouchableOpacity style={styles.captureBtn} onPress={captureAndScan}>
                  <Text style={styles.captureBtnText}>📷 Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setCameraOpen(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
      <Text style={globalStyles.title}>Bill Total</Text>
      <Text style={globalStyles.subtitle}>
        Scan your receipt to allocate items, or enter the total manually.
      </Text>

      {/* Scan button */}
      <TouchableOpacity style={[btnBlue.btn, { marginBottom: 8 }]} onPress={openCamera} activeOpacity={0.85}>
        <Text style={btnBlue.btnText}>📷  Scan Receipt</Text>
      </TouchableOpacity>

      {/* Scanned items preview */}
      {scannedItems.length > 0 && (
        <View style={globalStyles.card}>
          <Text style={styles.itemsTitle}>
            🧾 {scannedItems.length} items scanned
          </Text>
          {scannedItems.map((item, index) => (
            <View key={index} style={[globalStyles.spaceBetween, styles.itemRow]}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.orDivider}>
        <View style={globalStyles.divider} />
        <Text style={styles.orText}>enter total</Text>
        <View style={globalStyles.divider} />
      </View>

      {/* Manual total */}
      <Text style={globalStyles.label}>Bill subtotal (R)</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="0.00"
        placeholderTextColor={colours.textMuted}
        keyboardType="decimal-pad"
        value={manualTotal}
        onChangeText={setManualTotal}
      />

      {/* Tip */}
      <Text style={globalStyles.label}>Tip (%)</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="0"
        placeholderTextColor={colours.textMuted}
        keyboardType="decimal-pad"
        value={tipPercent}
        onChangeText={setTipPercent}
      />

      {/* Total preview */}
      {manualTotal !== '' && !isNaN(parseFloat(manualTotal)) && (
        <View style={[globalStyles.card, styles.totalPreview]}>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.previewLabel}>Subtotal</Text>
            <Text style={styles.previewValue}>R {parseFloat(manualTotal || 0).toFixed(2)}</Text>
          </View>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.previewLabel}>Tip ({tipPercent || 0}%)</Text>
            <Text style={styles.previewValue}>
              R {(parseFloat(manualTotal || 0) * ((parseFloat(tipPercent) || 0) / 100)).toFixed(2)}
            </Text>
          </View>
          <View style={globalStyles.divider} />
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R {(parseFloat(manualTotal || 0) * (1 + (parseFloat(tipPercent) || 0) / 100)).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Action buttons */}
      {scannedItems.length > 0 && (
        <TouchableOpacity
          style={[btnGold.btn, { marginTop: 16 }]}
          onPress={proceedToItemAllocation}
          activeOpacity={0.85}
        >
          <Text style={btnGold.btnText}>🧾 Allocate Items by Person →</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[btnGreen.btn, { marginTop: 8, marginBottom: 40 }]}
        onPress={proceedToManualSplit}
        activeOpacity={0.85}
      >
        <Text style={btnGreen.btnText}>Split Total Manually →</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemsTitle: { color: colours.accentGold, fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  itemRow:    { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colours.bgPanel },
  itemName:   { color: colours.textPrimary, fontSize: 13, flex: 1, marginRight: 8 },
  itemPrice:  { color: colours.accentGreen, fontSize: 13, fontWeight: 'bold' },
  orDivider:  { flexDirection: 'row', alignItems: 'center', marginVertical: 12, gap: 8 },
  orText:     { color: colours.textMuted, fontSize: 13, flexShrink: 0 },
  totalPreview: { marginTop: 12, borderLeftWidth: 3, borderLeftColor: colours.accentGreen },
  previewLabel: { color: colours.textMuted, fontSize: 14 },
  previewValue: { color: colours.textPrimary, fontSize: 14 },
  totalLabel:   { color: colours.textPrimary, fontWeight: 'bold', fontSize: 16 },
  totalValue:   { color: colours.accentGreen, fontWeight: 'bold', fontSize: 18 },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera:          { flex: 1 },
  cameraOverlay:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  receiptFrame:    { width: 300, height: 400, borderWidth: 2, borderColor: colours.accentGreen, borderRadius: 8, marginBottom: 16 },
  cameraHint:      { color: colours.white, fontSize: 14, textAlign: 'center', marginBottom: 16 },
  cameraButtons:   { flexDirection: 'row', gap: 16, marginTop: 8 },
  captureBtn:      { backgroundColor: colours.accentGreen, borderRadius: 50, paddingVertical: 14, paddingHorizontal: 28 },
  captureBtnText:  { color: colours.bgDark, fontWeight: 'bold', fontSize: 16 },
  cancelBtn:       { backgroundColor: colours.bgPanel, borderRadius: 50, paddingVertical: 14, paddingHorizontal: 20 },
  cancelBtnText:   { color: colours.textPrimary, fontSize: 15 },
  white:           { color: colours.white },
});