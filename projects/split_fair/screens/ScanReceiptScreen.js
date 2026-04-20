// screens/ScanReceiptScreen.js
// -----------------------------
// Allows users to scan a receipt using the device camera.
// Sends the image to the receipt-ocr-api on Vercel for text extraction,
// then parses the total from the response.
// Users can also enter the total manually.

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colours, globalStyles, buttonStyle } from '../utils/theme';

// ── Your deployed OCR API endpoint ──────────
const OCR_API_URL = 'https://receipt-ocr-api-sage.vercel.app/api';

/**
 * Attempt to extract a total amount from OCR text.
 * Looks for common receipt patterns like "TOTAL", "AMOUNT DUE", etc.
 */
function parseTotal(ocrText) {
  if (!ocrText) return null;

  const patterns = [
    /total[:\s]+r?\s*([\d]+[.,][\d]{2})/i,
    /amount due[:\s]+r?\s*([\d]+[.,][\d]{2})/i,
    /grand total[:\s]+r?\s*([\d]+[.,][\d]{2})/i,
    /balance[:\s]+r?\s*([\d]+[.,][\d]{2})/i,
    /r\s*([\d]+[.,][\d]{2})\s*$/im,
  ];

  for (const pattern of patterns) {
    const match = ocrText.match(pattern);
    if (match) {
      // Normalise comma-as-decimal (e.g. South African format)
      return parseFloat(match[1].replace(',', '.'));
    }
  }
  return null;
}

export default function ScanReceiptScreen({ navigation, route }) {
  const { people, payments } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen]     = useState(false);
  const [scanning, setScanning]         = useState(false);
  const [ocrResult, setOcrResult]       = useState('');
  const [manualTotal, setManualTotal]   = useState('');
  const [tipPercent, setTipPercent]     = useState('0');
  const cameraRef = useRef(null);

  const btnGreen = buttonStyle(colours.accentGreen);
  const btnBlue  = buttonStyle(colours.accentBlue);

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

  // ── Capture photo and send to OCR API ────
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
        body: JSON.stringify({ image: photo.base64 }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.text || data.result || '';
      setOcrResult(text);
      setCameraOpen(false);

      // Try to auto-fill the total
      const parsed = parseTotal(text);
      if (parsed) {
        setManualTotal(parsed.toString());
        Alert.alert(
          'Total detected! 🎉',
          `We found R ${parsed.toFixed(2)}. You can edit this if needed.`
        );
      } else {
        Alert.alert(
          'Could not auto-detect total',
          'Please enter the total manually below.'
        );
      }
    } catch (error) {
      Alert.alert('Scan failed', `${error.message}\n\nPlease enter the total manually.`);
      setCameraOpen(false);
    } finally {
      setScanning(false);
    }
  };

  // ── Proceed to split screen ───────────────
  const proceed = () => {
    const subtotal = parseFloat(manualTotal);
    if (isNaN(subtotal) || subtotal <= 0) {
      Alert.alert('Invalid total', 'Please enter a valid bill total.');
      return;
    }
    const tip   = parseFloat(tipPercent) || 0;
    const tipAmt = parseFloat((subtotal * (tip / 100)).toFixed(2));
    const total  = parseFloat((subtotal + tipAmt).toFixed(2));

    navigation.navigate('Split', {
      people,
      payments,
      subtotal,
      tipPercent: tip,
      tipAmount: tipAmt,
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
              Align the receipt total within the frame
            </Text>
            {scanning ? (
              <ActivityIndicator
                size="large"
                color={colours.accentGreen}
                style={{ marginTop: 20 }}
              />
            ) : (
              <View style={styles.cameraButtons}>
                <TouchableOpacity
                  style={styles.captureBtn}
                  onPress={captureAndScan}
                >
                  <Text style={styles.captureBtnText}>📷 Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setCameraOpen(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    );
  }

  // ── Main screen ───────────────────────────
  return (
    <ScrollView style={globalStyles.screen}>
      <Text style={globalStyles.title}>Bill Total</Text>
      <Text style={globalStyles.subtitle}>
        Scan your receipt or enter the total manually.
      </Text>

      {/* Scan button */}
      <TouchableOpacity
        style={[btnBlue.btn, styles.scanBtn]}
        onPress={openCamera}
        activeOpacity={0.85}
      >
        <Text style={btnBlue.btnText}>📷  Scan Receipt</Text>
      </TouchableOpacity>

      <View style={styles.orDivider}>
        <View style={globalStyles.divider} />
        <Text style={styles.orText}>or enter manually</Text>
        <View style={globalStyles.divider} />
      </View>

      {/* Manual total input */}
      <Text style={globalStyles.label}>Bill subtotal (R)</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="0.00"
        placeholderTextColor={colours.textMuted}
        keyboardType="decimal-pad"
        value={manualTotal}
        onChangeText={setManualTotal}
      />

      {/* Tip input */}
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
            <Text style={styles.previewValue}>
              R {parseFloat(manualTotal || 0).toFixed(2)}
            </Text>
          </View>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.previewLabel}>
              Tip ({tipPercent || 0}%)
            </Text>
            <Text style={styles.previewValue}>
              R {(parseFloat(manualTotal || 0) * ((parseFloat(tipPercent) || 0) / 100)).toFixed(2)}
            </Text>
          </View>
          <View style={globalStyles.divider} />
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R {(
                parseFloat(manualTotal || 0) *
                (1 + (parseFloat(tipPercent) || 0) / 100)
              ).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* OCR result (collapsible debug info) */}
      {ocrResult !== '' && (
        <View style={globalStyles.card}>
          <Text style={styles.ocrLabel}>📄 Scanned text:</Text>
          <Text style={styles.ocrText}>{ocrResult}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[btnGreen.btn, { marginBottom: 40 }]}
        onPress={proceed}
        activeOpacity={0.85}
      >
        <Text style={btnGreen.btnText}>Next: Choose Split Method →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scanBtn: { marginBottom: 8 },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  orText: {
    color: colours.textMuted,
    fontSize: 13,
    flexShrink: 0,
  },
  totalPreview: {
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: colours.accentGreen,
  },
  previewLabel: { color: colours.textMuted, fontSize: 14 },
  previewValue: { color: colours.textPrimary, fontSize: 14 },
  totalLabel:   { color: colours.textPrimary, fontWeight: 'bold', fontSize: 16 },
  totalValue:   { color: colours.accentGreen, fontWeight: 'bold', fontSize: 18 },
  ocrLabel:     { color: colours.textMuted, fontSize: 12, marginBottom: 4 },
  ocrText:      { color: colours.textMuted, fontSize: 11, fontFamily: 'monospace' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera:          { flex: 1 },
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  receiptFrame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: colours.accentGreen,
    borderRadius: 8,
    marginBottom: 16,
  },
  cameraHint: {
    color: colours.white,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  captureBtn: {
    backgroundColor: colours.accentGreen,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  captureBtnText: {
    color: colours.bgDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: colours.bgPanel,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  cancelBtnText: {
    color: colours.textPrimary,
    fontSize: 15,
  },
});
