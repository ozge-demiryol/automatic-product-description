import { RepositoryBase } from '../base.repository';
import { ProductModel, IProduct } from './product.model';
import { Types } from 'mongoose';

export class ProductRepository implements RepositoryBase<IProduct> {
  async findAll(): Promise<IProduct[]> {
    return await ProductModel.find().exec();
  }
  async findById(id: Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findById(id).exec();
  }
  async delete(id: Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findByIdAndDelete(id).exec();
  }
  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(productData);
    return await product.save();
  }

  async update(productData: Partial<IProduct>): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(productData._id, productData, { new: true });
  }
}