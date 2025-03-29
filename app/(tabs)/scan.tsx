import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Camera as CameraIcon, Image as ImageIcon, X, Loader as Loader2 } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors, typography, spacing, shadows } from '@/constants/theme';
import CustomImagePicker from '@/components/ImagePicker';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCapture = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleImageSelected = (uri: string) => {
    setSelectedImage(uri);
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop' }}
            style={styles.permissionImage}
          />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to help you analyze your crops and provide detailed health insights.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?q=80&w=800&auto=format&fit=crop' }}
            style={styles.webImage}
          />
          <Text style={styles.webTitle}>Camera Not Available</Text>
          <Text style={styles.webText}>
            The camera feature is not available on web. Please use our mobile app for the full experience.
          </Text>
          <CustomImagePicker onImageSelected={handleImageSelected} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
              <CameraIcon size={24} color="white" />
            </TouchableOpacity>
            <CustomImagePicker onImageSelected={handleImageSelected} />
          </View>
          <View style={styles.cropFrame}>
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <Loader2 size={48} color={colors.primary} />
                <Text style={styles.analyzingText}>Analyzing crop health...</Text>
              </View>
            )}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
              onPress={handleCapture}
              disabled={isAnalyzing}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropFrame: {
    flex: 1,
    margin: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 4,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 32,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  analyzingText: {
    ...typography.body,
    color: 'white',
    marginTop: spacing.md,
  },
  permissionContainer: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: spacing.xl,
  },
  permissionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.body,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  permissionButtonText: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  webContainer: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  webTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  webText: {
    ...typography.body,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});