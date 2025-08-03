import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicy extends Document {
  _id: mongoose.Types.ObjectId;
  policyId: string;
  sellerId: string;
  type: PolicyType;
  title?: string;
  content: string;
  effectiveDate?: Date; 
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

export enum PolicyType {
  Return = 'return',
  Shipping = 'shipping',
  Warranty = 'warranty',
  General = 'general',
}

const PolicySchema: Schema = new Schema(
  {
    policyId: { type: String, required: true, unique: true },
    sellerId: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(PolicyType),
    },
    title: { type: String },
    content: { type: String, required: true },
    effectiveDate: { type: Date },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PolicyModel = mongoose.model<IPolicy>('Policy', PolicySchema);