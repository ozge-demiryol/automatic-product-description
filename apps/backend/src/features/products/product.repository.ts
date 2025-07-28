import { IProductRepository } from './IProductRepository';
import { ProductModel, IProduct } from './product.model';
import { Types } from 'mongoose';

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<IProduct[]> {
    return await ProductModel.find().exec();
  }
  async findById(id: Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findById(id).exec();
  }
  delete(id: Types.ObjectId): Promise<IProduct | null> {
    throw new Error('Method not implemented.');
  }
  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(productData);
    return await product.save();
  }

  async update(productData: Partial<IProduct>): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(productData._id, productData, { new: true });
  }


}