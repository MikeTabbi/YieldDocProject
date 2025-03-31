import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { Send, Camera, Image as ImageIcon, PlusCircle } from 'lucide-react-native';
import { colors, spacing, shadows } from '@/constants/theme';
import CameraCapture from './CameraCapture';
import * as ImagePicker from 'expo-image-picker';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendImage: (uri: string) => void;
  isLoading?: boolean;
}

const plantSymptoms = [
  'Yellowing Leaves',
  'Wilting',
  'Spots on Leaves',
  'Stunted Growth',
  'Dropping Leaves',
  'Curling Leaves',
  'White Powdery Substance',
  'Mold/Fungus',
];

export default function ChatInput({
  onSendMessage,
  onSendImage,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);


  const cleanMessageContent = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/\*(.*?)\*/g, '$1')     // remove italic
    .replace(/^- /gm, '• ')          // replace dash bullets with dot
    .replace(/^#+ /gm, '')           // remove markdown headers
    .trim();
};

  const handleSend = () => {
    let finalMessage = message.trim();
    if (selectedSymptoms.length > 0) {
      finalMessage =
        `Symptoms: ${selectedSymptoms.join(', ')}\n` + finalMessage;
    }
    if (finalMessage) {
      onSendMessage(finalMessage);
      setMessage('');
      setSelectedSymptoms([]);
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
      if (!permission.granted) return;

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

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowSymptoms(true)}
              disabled={isLoading}>
              <PlusCircle size={24} color={colors.text} />
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
            disabled={!message.trim() && selectedSymptoms.length === 0 || isLoading}>
            <Send
              size={24}
              color={
                message.trim() || selectedSymptoms.length > 0
                  ? colors.text
                  : 'rgba(0,0,0,0.3)'
              }
            />
          </TouchableOpacity>
        </View>

        {/* Camera Modal */}
        <Modal visible={showCamera} animationType="slide" presentationStyle="fullScreen">
          <CameraCapture
            onImageCaptured={handleImageCaptured}
            onClose={() => setShowCamera(false)}
          />
        </Modal>

        {/* Symptom Selector Modal */}
        <Modal visible={showSymptoms} animationType="fade" transparent>
          <Pressable style={styles.modalOverlay} onPress={() => setShowSymptoms(false)}>
            <Pressable style={styles.symptomModal} onPress={() => {}}>
              <Text style={styles.modalTitle}>Select Plant Symptoms</Text>
              <ScrollView>
                {plantSymptoms.map((symptom, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.symptomOption,
                      selectedSymptoms.includes(symptom) && styles.selectedSymptom,
                    ]}
                    onPress={() => toggleSymptom(symptom)}>
                    <Text
                      style={[
                        styles.symptomText,
                        selectedSymptoms.includes(symptom) && { color: 'white' },
                      ]}>
                      {symptom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.button, styles.sendButton, { marginTop: spacing.md }]}
                onPress={() => setShowSymptoms(false)}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Done</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symptomModal: {
    backgroundColor: 'white',
    width: '85%',
    padding: spacing.lg,
    borderRadius: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  symptomOption: {
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
    backgroundColor: '#f0f0f0',
  },
  selectedSymptom: {
    backgroundColor: colors.primary,
  },
  symptomText: {
    color: '#333',
  },
});
