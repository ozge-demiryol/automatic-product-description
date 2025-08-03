import { ProductRepository } from '../product.repository';
import { IProduct } from '../product.model';
import { AddProductCommandPayload } from '../addProduct/AddProductCommandPayload';

export class AddProductCommandHandler {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(payload: AddProductCommandPayload): Promise<IProduct> {
    const {name, category, keywords, description, price } = payload;

    console.log("Ürün veri tabanına kaydediliyor...")
    const newProduct = await this.productRepository.create({
      name,
      category,
      keywords,
      description,
      price
    });

    return newProduct;
  }
}