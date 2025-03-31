import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Message } from '@/types/chat';
import { colors, typography, spacing, shadows } from '@/constants/theme';

interface ChatMessageProps {
  message: Message;
}

const cleanMessageContent = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
    .replace(/^- /gm, '• ')          // Replace dash bullets with dot
    .replace(/^#+ /gm, '')           // Remove markdown headers
    .trim();
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const cleanedContent = cleanMessageContent(message.content);

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {message.type === 'image' && message.imageUrl && (
          <Image
            source={{ uri: message.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {cleanedContent.split('\n').map((line, index) => (
          <Text
            key={index}
            style={[styles.text, isUser ? styles.userText : styles.botText]}>
            {line}
          </Text>
        ))}
        <Text
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.botTimestamp,
          ]}>
          {format(message.timestamp, 'HH:mm')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: spacing.md,
    ...shadows.small,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  text: {
    ...typography.body,
    marginBottom: 4,
  },
  userText: {
    color: colors.text,
  },
  botText: {
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  userTimestamp: {
    color: colors.text,
    opacity: 0.7,
    textAlign: 'right',
  },
  botTimestamp: {
    color: colors.text,
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
});
