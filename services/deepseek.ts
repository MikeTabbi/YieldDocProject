import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types/chat';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';
const API_KEY = 'sk-4a202116742d43aea313302d986aaf8b';
const CONVERSATION_HISTORY_KEY = 'chat_history';
const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
const CONNECTION_TIMEOUT = 10000; // 10 second timeout

interface DeepseekResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepseekService {
  private axiosInstance;
  private requestQueue: Promise<any> = Promise.resolve();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: DEEPSEEK_API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: CONNECTION_TIMEOUT,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Remove sensitive data from logs
        const sanitizedConfig = { ...config };
        if (sanitizedConfig.headers?.Authorization) {
          sanitizedConfig.headers.Authorization = '[REDACTED]';
        }
        console.log('API Request:', {
          url: sanitizedConfig.url,
          method: sanitizedConfig.method,
          timestamp: new Date().toISOString(),
        });
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('API Response:', {
          status: response.status,
          timestamp: new Date().toISOString(),
        });
        return response;
      },
      (error) => {
        if (axios.isCancel(error)) {
          console.error('Request cancelled:', error.message);
          return Promise.reject(new Error('Request was cancelled'));
        }

        if (error.code === 'ECONNABORTED') {
          console.error('Connection timeout:', error.message);
          return Promise.reject(new Error('Connection timeout. Please try again'));
        }

        console.error('Response Error:', {
          status: error.response?.status,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
        return Promise.reject(error);
      }
    );
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES,
    delay = RATE_LIMIT_DELAY
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries === 0 || !this.shouldRetry(error)) {
        throw error;
      }
      
      console.log(`Retrying request. Attempts remaining: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryWithExponentialBackoff(operation, retries - 1, delay * 2);
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors and specific status codes
    if (!error.response) {
      return true; // Retry on network errors
    }
    const status = error.response.status;
    return status === 429 || (status >= 500 && status < 600);
  }

  private async queueRequest<T>(operation: () => Promise<T>): Promise<T> {
    this.requestQueue = this.requestQueue.then(async () => {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      return operation();
    }).catch(error => {
      console.error('Queue request error:', error);
      throw error;
    });
    return this.requestQueue;
  }

  async sendMessage(message: string, conversationId?: string): Promise<string> {
    const history = await this.loadConversationHistory(conversationId);
    
    const operation = async () => {
      try {
        const response = await this.axiosInstance.post<DeepseekResponse>('/chat/completions', {
          model: 'deepseek-chat',
          messages: [
            ...history.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content,
            })),
            { role: 'user', content: message },
          ],
        });

        const reply = response.data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
        
        // Save to history
        await this.saveToHistory({
          id: Date.now().toString(),
          type: 'text',
          content: message,
          timestamp: new Date(),
          sender: 'user',
        }, conversationId);

        await this.saveToHistory({
          id: response.data.id,
          type: 'text',
          content: reply,
          timestamp: new Date(),
          sender: 'bot',
        }, conversationId);

        return reply;
      } catch (error: any) {
        console.error('Error sending message:', error.message);
        throw new Error(this.getErrorMessage(error));
      }
    };

    return this.retryWithExponentialBackoff(() => 
      this.queueRequest(operation)
    );
  }

  private getErrorMessage(error: any): string {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Connection timeout. Please try again.';
      }
      if (error.code === 'ERR_NETWORK') {
        return 'Network error. Please check your internet connection.';
      }
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    switch (error.response.status) {
      case 401:
        return 'Authentication failed. Please check your API key.';
      case 403:
        return 'Access forbidden. Please check your API permissions.';
      case 404:
        return 'API endpoint not found. Please check the API configuration.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.response.data?.error?.message || 'Unknown error occurred'}`;
    }
  }

  private async loadConversationHistory(conversationId = 'default'): Promise<Message[]> {
    try {
      const history = await AsyncStorage.getItem(`${CONVERSATION_HISTORY_KEY}_${conversationId}`);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  }

  private async saveToHistory(message: Message, conversationId = 'default'): Promise<void> {
    try {
      const history = await this.loadConversationHistory(conversationId);
      history.push(message);
      await AsyncStorage.setItem(
        `${CONVERSATION_HISTORY_KEY}_${conversationId}`,
        JSON.stringify(history.slice(-50)) // Keep last 50 messages
      );
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  async clearHistory(conversationId = 'default'): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CONVERSATION_HISTORY_KEY}_${conversationId}`);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}

export const deepseekService = new DeepseekService();