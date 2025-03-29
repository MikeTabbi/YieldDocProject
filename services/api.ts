import { Message } from '@/types/chat';
import axios from 'axios';

const API_URL = 'https://api.deepseek.com/v1';
const API_KEY = 'sk-4a202116742d43aea313302d986aaf8b';

export class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async processTextMessage(message: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      });

      return response.data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('Error processing text message:', error);
      throw new Error('Failed to process message');
    }
  }

  async processImageMessage(imageUrl: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Please analyze this image: ${imageUrl}`
          }
        ]
      });

      return response.data.choices[0]?.message?.content || 'Failed to analyze image';
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }
}

export const apiService = new ApiService();