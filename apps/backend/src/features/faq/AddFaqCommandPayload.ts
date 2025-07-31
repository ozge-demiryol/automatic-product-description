import { Types } from 'mongoose';

export interface AddFaqCommandPayload {
  productId: Types.ObjectId;
  question: string;
  answer: string;
}