import { ProductModel, IProduct } from './product.model';

export interface IProductRepository {
  create(productData: Partial<IProduct>): Promise<IProduct>;
}
export class ProductRepository implements IProductRepository {
  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(productData);
    return await product.save();
  }
}