import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, X, Check, Plus } from 'lucide-react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';
import { DocumentScan } from '@/types/chat';

interface DocumentScannerProps {
  onScanComplete: (scans: DocumentScan[]) => void;
  onClose: () => void;
}

export default function DocumentScanner({ onScanComplete, onClose }: DocumentScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedPages, setScannedPages] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = async () => {
    setIsScanning(true);
    // Simulate document edge detection and processing
    setTimeout(() => {
      const newPage = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop';
      setScannedPages([...scannedPages, newPage]);
      setIsScanning(false);
    }, 1000);
  };

  const removePage = (index: number) => {
    setScannedPages(pages => pages.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    const scans: DocumentScan[] = scannedPages.map((uri, index) => ({
      uri,
      name: `Scan_${Date.now()}_${index + 1}`,
      type: 'application/pdf',
      size: 1024 * 1024, // Simulated 1MB size
      pages: 1,
    }));
    onScanComplete(scans);
  };

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan documents.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Not Available</Text>
          <Text style={styles.permissionText}>
            Document scanning is not available on web. Please use our mobile app for this feature.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Document</Text>
        {scannedPages.length > 0 && (
          <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
            <Check size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} type="back">
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
          </View>
        </CameraView>
      </View>

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>
          Scanned Pages ({scannedPages.length})
        </Text>
        <View style={styles.previewGrid}>
          {scannedPages.map((uri, index) => (
            <View key={index} style={styles.previewItem}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePage(index)}>
                <X size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.previewItem, styles.addButton]}
            onPress={handleCapture}
            disabled={isScanning}>
            <Plus size={32} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: 'white',
    ...shadows.small,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.sm,
  },
  completeButton: {
    padding: spacing.sm,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
  },
  previewContainer: {
    padding: spacing.md,
    backgroundColor: 'white',
  },
  previewTitle: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  previewItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadows.small,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    ...shadows.small,
  },
  addButton: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.body,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  buttonText: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
});