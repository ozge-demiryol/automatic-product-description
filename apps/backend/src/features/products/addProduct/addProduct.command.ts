import { ProductRepository } from '../product.repository';
import { IProduct } from '../product.model';
import { AddProductCommandPayload } from '../addProduct/AddProductCommandPayload';
import { IProductRepository } from '../IProductRepository';

export class AddProductCommandHandler {
  private productRepository: IProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(payload: AddProductCommandPayload): Promise<IProduct> {
    const {name, category, keywords, description } = payload;

    console.log("Ürün veri tabanına kaydediliyor...")
    const newProduct = await this.productRepository.create({
      name,
      category,
      keywords,
      description,
    });

    return newProduct;
  }
}