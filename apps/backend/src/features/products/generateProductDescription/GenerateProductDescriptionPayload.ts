import { Types } from "mongoose";

export interface GenerateProductDescripitonPayload {
    id: Types.ObjectId;
    name: string, 
    category: string, 
    keywords: string[], 
    tone: string
}