import { Types } from "mongoose";
import { IProduct } from "./product.model";

export interface IProductRepository {
  create(productData: Partial<IProduct>): Promise<IProduct>;
  update(productData: Partial<IProduct>): Promise<IProduct | null>;
  findAll(): Promise<IProduct[]>;
  findById(id: Types.ObjectId): Promise<IProduct | null>;
  delete(id: Types.ObjectId): Promise<IProduct | null>;
}