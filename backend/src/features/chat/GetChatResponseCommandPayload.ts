import { Types } from 'mongoose';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GetChatResponseCommandPayload {
  messages: ChatMessage[];
  productId: Types.ObjectId;
  // sellerId: Types.ObjectId;
}