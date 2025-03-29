import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';
import { Message, DocumentScan } from '@/types/chat';
import { apiService } from '@/services/api';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<FlatList>(null);

  const addMessage = (
    content: string,
    type: 'text' | 'image' | 'document' = 'text',
    extras: Partial<Message> = {}
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      sender: 'user',
      ...extras,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const addBotResponse = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content,
      timestamp: new Date(),
      sender: 'bot',
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSendMessage = async (text: string) => {
    try {
      setError(null);
      setIsLoading(true);
      addMessage(text);

      const response = await apiService.processTextMessage(text);
      addBotResponse(response);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendImage = async (uri: string) => {
    try {
      setError(null);
      setIsLoading(true);
      addMessage('Analyzing image...', 'image', { imageUrl: uri });

      const response = await apiService.processImageMessage(uri);
      addBotResponse(response);
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDocument = async (scans: DocumentScan[]) => {
    try {
      setError(null);
      setIsLoading(true);

      for (const scan of scans) {
        addMessage(
          scan.name,
          'document',
          {
            documentUrl: scan.uri,
            documentName: scan.name,
            documentPages: scan.pages,
          }
        );

        const response = await apiService.processImageMessage(scan.uri);
        addBotResponse(response);
      }
    } catch (err) {
      setError('Failed to process document');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Implement chat history refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.messageList}
        inverted={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start a conversation!</Text>
          </View>
        }
        ListFooterComponent={isLoading ? <TypingIndicator /> : null}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onSendDocument={handleSendDocument}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    backgroundColor: 'white',
    ...shadows.small,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  messageList: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.subheading,
    color: colors.text,
    opacity: 0.7,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text,
    opacity: 0.5,
    marginTop: spacing.xs,
  },
});