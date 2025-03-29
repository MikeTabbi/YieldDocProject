import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { Slash as Flash, Camera as FlipCamera, Camera as CameraIcon, X, Check, Focus } from 'lucide-react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';

interface CameraCaptureProps {
  onImageCaptured: (uri: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onImageCaptured, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const [isFocusing, setIsFocusing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  const handleCapture = async () => {
    if (!camera) return;
    try {
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const handleAccept = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'on' ? 'off' : 'on'));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to capture images for the chat.
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
            Camera capture is not available on web. Please use our mobile app for this feature.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleRetake} style={styles.iconButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Preview Image</Text>
          <TouchableOpacity onPress={handleAccept} style={styles.iconButton}>
            <Check size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={styles.previewOverlay}>
            <TouchableOpacity style={styles.previewButton} onPress={handleRetake}>
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.previewButton, styles.acceptButton]} 
              onPress={handleAccept}
            >
              <Text style={styles.previewButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Take Photo</Text>
        <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
          <Flash size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={setCamera}
          style={styles.camera}
          type={cameraType}
          flashMode={flash}
          onTouchStart={() => setIsFocusing(true)}
          onTouchEnd={() => setIsFocusing(false)}
        >
          <View style={styles.overlay}>
            {isFocusing && (
              <View style={styles.focusIndicator}>
                <Focus size={48} color={colors.primary} />
              </View>
            )}
            <View style={styles.guidelines}>
              <View style={styles.guideline} />
              <View style={styles.guideline} />
              <View style={styles.guideline} />
              <View style={styles.guideline} />
            </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={toggleCameraType}
        >
          <FlipCamera size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={handleCapture}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <View style={{ width: 44 }} />
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusIndicator: {
    position: 'absolute',
    padding: spacing.md,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  guidelines: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
  },
  guideline: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'white',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 4,
  },
  captureButtonInner: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 32,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: 'white',
    ...shadows.medium,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  previewButtonText: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
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