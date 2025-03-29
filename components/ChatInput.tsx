import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Send, Camera, Image as ImageIcon } from 'lucide-react-native';
import { colors, spacing, shadows } from '@/constants/theme';
import CameraCapture from './CameraCapture';
import * as ImagePicker from 'expo-image-picker';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendImage: (uri: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onSendImage,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleImageCaptured = (uri: string) => {
    setShowCamera(false);
    onSendImage(uri);
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.mediaButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCamera(true)}
              disabled={isLoading}>
              <Camera size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePickImage}
              disabled={isLoading}>
              <ImageIcon size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}>
            <Send
              size={24}
              color={message.trim() ? colors.text : 'rgba(0,0,0,0.3)'}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showCamera}
          animationType="slide"
          presentationStyle="fullScreen">
          <CameraCapture
            onImageCaptured={handleImageCaptured}
            onClose={() => setShowCamera(false)}
          />
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: 'white',
    gap: spacing.sm,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    ...shadows.small,
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
});