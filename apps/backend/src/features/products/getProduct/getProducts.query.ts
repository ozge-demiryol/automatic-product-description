import { IProduct } from '../product.model';
import { ProductRepository } from '../product.repository';

export class GetAllProductsQuery {
  constructor() {}
}
export class GetAllProductsQueryHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<IProduct[]> {
    return this.productRepository.findAll();
  }
}

