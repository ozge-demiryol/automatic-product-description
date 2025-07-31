// src/services/productService.ts
import { MongoDataManager } from "@/app/api/repository/mongoDataManager";
import { WithId, ObjectId } from "mongodb";
import { Product } from "@/types/product";

export class ProductService {
  private collectionName = "products";
  private mdm = new MongoDataManager<Product>();

  async getAllProducts(): Promise<WithId<Product>[]> {
    return await this.mdm.find(this.collectionName);
  }

  async getProductById(id: string): Promise<WithId<Product> | null> {
    const objectId = new ObjectId(id);
    return await this.mdm.findOne(this.collectionName, {
      _id: objectId,
    });
  }

  async createProduct(product: Product): Promise<WithId<Product>> {
    const newProduct = { ...product, createdAt: new Date() };
    return await this.mdm.insertOne(this.collectionName, newProduct);
  }

  async updateProduct(
    id: string,
    updatedFields: Partial<Product>
  ): Promise<boolean> {
    return await this.mdm.updateOne(
      this.collectionName,
      { _id: id },
      updatedFields
    );
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.mdm.deleteOne(this.collectionName, { _id: id });
  }
}
