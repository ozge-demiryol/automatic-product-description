import { Types } from "mongoose";

export interface AddProductCommandPayload {
  name: string;
  category: string;
  keywords: string[];
  description?: string;
  price: number
}