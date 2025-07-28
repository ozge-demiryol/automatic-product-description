import { IProductRepository } from '../IProductRepository';
import { IProduct } from '../product.model';
import { Types } from 'mongoose';

export class GetProductByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetProductByIdQueryHandler {
  // The handler depends on the repository via its interface for loose coupling.
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(query: GetProductByIdQuery): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(query.id)) {
      return null;
    }

    return this.productRepository.findById(new Types.ObjectId(query.id));
  }
}

