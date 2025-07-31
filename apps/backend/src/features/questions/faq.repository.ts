import { Types } from 'mongoose';
import { FAQModel, IFAQ } from '../faq/faq.model';
import { RepositoryBase } from '../base.repository';

export class FaqRepository implements RepositoryBase<IFAQ> {
  async findAll(): Promise<IFAQ[]> {
    return await FAQModel.find().exec();
  }
  async findById(id: Types.ObjectId): Promise<IFAQ | null> {
    return await FAQModel.findById(id).exec();
  }
  async delete(id: Types.ObjectId): Promise<IFAQ | null> {
    return await FAQModel.findByIdAndDelete(id).exec();
  }
  async create(faqData: Partial<IFAQ>): Promise<IFAQ> {
    const product = new FAQModel(faqData);
    return await product.save();
  }

  async update(faqData: Partial<IFAQ>): Promise<IFAQ | null> {
    return await FAQModel.findByIdAndUpdate(faqData._id, faqData, { new: true });
  }
}