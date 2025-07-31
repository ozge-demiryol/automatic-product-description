import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId | string;
  name: string;
  category: string;
  keywords: string[];
  description?: string;
  price: number;
  createdAt?: Date;
}

export interface ProductInput {
  name: string;
  category: string;
  tone: string;
  keywords: string[];
}

export interface GeneratedDescriptionResponse {
  seoScore: number;
  productDescription: string;
  customerQuestions?: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SavedProductResponse {
  _id: string;
}

export interface FinalProductSave {
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  keywords: string[];
}
