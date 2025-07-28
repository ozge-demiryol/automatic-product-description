import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  keywords: string[];
  description: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  keywords: [{ type: String, required: true }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);