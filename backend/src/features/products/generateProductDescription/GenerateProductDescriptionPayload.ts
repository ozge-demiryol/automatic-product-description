import { Types } from "mongoose";

export interface GenerateProductDescripitonPayload {
    name: string, 
    category: string, 
    keywords: string[], 
    tone: string
}