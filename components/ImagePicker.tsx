import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, Camera, X } from 'lucide-react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_RESOLUTION = { width: 640, height: 480 };

type ImagePickerProps = {
  onImageSelected: (uri: string) => void;
};

export default function CustomImagePicker({ onImageSelected }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateImage = async (uri: string): Promise<boolean> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      if (blob.size > MAX_FILE_SIZE) {
        setError('Image size exceeds 10MB limit');
        return false;
      }

      return new Promise((resolve) => {
        Image.getSize(
          uri,
          (width, height) => {
            if (width < MIN_RESOLUTION.width || height < MIN_RESOLUTION.height) {
              setError(`Image must be at least ${MIN_RESOLUTION.width}x${MIN_RESOLUTION.height}`);
              resolve(false);
            } else {
              resolve(true);
            }
          },
          (error) => {
            setError('Failed to load image');
            resolve(false);
          }
        );
      });
    } catch (err) {
      setError('Failed to validate image');
      return false;
    }
  };

  const pickImage = async () => {
    try {
      setError(null);
      setLoading(true);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        setError('Permission to access photos was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const isValid = await validateImage(result.assets[0].uri);
        
        if (isValid) {
          setImage(result.assets[0].uri);
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (err) {
      setError('Failed to pick image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      ) : image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
            <X size={24} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.retakeButton} onPress={pickImage}>
            <Camera size={24} color={colors.text} />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <ImageIcon size={24} color={colors.text} />
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    width: '100%',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  clearButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.sm,
    ...shadows.small,
  },
  retakeButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.small,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    ...shadows.small,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
});