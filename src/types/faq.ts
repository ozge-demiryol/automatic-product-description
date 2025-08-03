import { ObjectId } from "mongodb";

export interface FAQ {
    _id: ObjectId | string;
    productId: ObjectId;
    question: string;
    answer: string;
    embedding: number[];
    chunkText: string;
    createdAt: Date;
    updatedAt: Date;
}