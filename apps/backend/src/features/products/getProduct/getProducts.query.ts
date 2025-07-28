import { IProductRepository } from '../IProductRepository';
import { IProduct } from '../product.model';

export class GetAllProductsQuery {
  constructor() {}
}
export class GetAllProductsQueryHandler {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<IProduct[]> {
    return this.productRepository.findAll();
  }
}

