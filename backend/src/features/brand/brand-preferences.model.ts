import mongoose, { Schema, Document } from 'mongoose';

export enum Tone {
  Formal = 'formal',
  Friendly = 'friendly',
  Apologetic = 'apologetic',
  Casual = 'casual',
}

export interface IBrand extends Document {
  _id: mongoose.Types.ObjectId;
  sellerId: string;
  tone: Tone;
  language?: string;
  preferredKeywords?: string[];
  disallowedPhrases?: string[];
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
  {
    sellerId: { type: String, required: true, unique: true, index: true },
    tone: {
      type: String,
      required: true,
      enum: Object.values(Tone),
    },
    language: { type: String },
    preferredKeywords: { type: [String] },
    disallowedPhrases: { type: [String] },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  },
);

export const BrandModel = mongoose.model<IBrand>('Brand', BrandSchema);

