import { RepositoryBase } from '../base.repository';
import { PolicyModel, IPolicy } from './policy.model';
import { Types } from 'mongoose';

export class PolicyRepository implements RepositoryBase<IPolicy> {
  async findAll(): Promise<IPolicy[]> {
    return await PolicyModel.find().exec();
  }
  async findById(id: Types.ObjectId): Promise<IPolicy | null> {
    return await PolicyModel.findById(id).exec();
  }
  async delete(id: Types.ObjectId): Promise<IPolicy | null> {
    return await PolicyModel.findByIdAndDelete(id).exec();
  }
  async create(PolicyData: Partial<IPolicy>): Promise<IPolicy> {
    const policy = new PolicyModel(PolicyData);
    return await policy.save();
  }

  async update(PolicyData: Partial<IPolicy>): Promise<IPolicy | null> {
    return await PolicyModel.findByIdAndUpdate(PolicyData._id, PolicyData, { new: true });
  }
}