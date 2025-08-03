import { Document, Schema, model, Types } from 'mongoose';

export interface IFAQ extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  question: string;
  answer: string;
  embedding: number[];
  chunkText: string;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  embedding: { type: [Number], required: true },
  chunkText: { type: String, required: true },
}, { timestamps: true });

export const FAQModel = model<IFAQ>('Faq', FAQSchema);