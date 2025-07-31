import { Types } from "mongoose";

export interface RepositoryBase<T> {
  create(productData: Partial<T>): Promise<T>;
  update(productData: Partial<T>): Promise<T | null>;
  findAll(): Promise<T[]>;
  findById(id: Types.ObjectId): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<T | null>;
}