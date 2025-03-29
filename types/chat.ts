import { ImagePickerAsset } from 'expo-image-picker';

export type MessageType = 'text' | 'image' | 'document';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  sender: 'user' | 'bot';
  imageUrl?: string;
  documentUrl?: string;
  documentPages?: number;
  documentName?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface DocumentScan {
  uri: string;
  name: string;
  type: string;
  size: number;
  pages: number;
}