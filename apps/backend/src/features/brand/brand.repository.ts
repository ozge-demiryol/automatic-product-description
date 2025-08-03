import { RepositoryBase } from '../base.repository';
import { BrandModel, IBrand } from './brand-preferences.model';
import { Types } from 'mongoose';

export class BrandRepository implements RepositoryBase<IBrand> {
  async findAll(): Promise<IBrand[]> {
    return await BrandModel.find().exec();
  }
  async findById(id: Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findById(id).exec();
  }
  async delete(id: Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findByIdAndDelete(id).exec();
  }
  async create(PolicyData: Partial<IBrand>): Promise<IBrand> {
    const policy = new BrandModel(PolicyData);
    return await policy.save();
  }

  async update(PolicyData: Partial<IBrand>): Promise<IBrand | null> {
    return await BrandModel.findByIdAndUpdate(PolicyData._id, PolicyData, { new: true });
  }
}