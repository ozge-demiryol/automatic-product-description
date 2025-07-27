import { GeminiAIProvider } from '../../../providers/gemini.provider';
import { IProductRepository, ProductRepository } from '../product.repository';
import { IProduct } from '../product.model';

export interface AddProductCommandPayload {
  name: string;
  category: string;
  keywords: string[];
  tone: string;
}

export class AddProductCommandHandler {
  private geminiProvider: GeminiAIProvider;
  private productRepository: IProductRepository;

  constructor() {
    this.geminiProvider = new GeminiAIProvider();
    this.productRepository = new ProductRepository();
  }

  async execute(payload: AddProductCommandPayload): Promise<IProduct> {
    const { name, category, keywords, tone } = payload;

    console.log("Ürün açıklaması Gemini AI ile oluşturuluyor...")

    // 1. Gemini AI kullanarak ürün açıklamasını oluştur
    //UpdateProduct içine taşı, başlangıçta açıklama boş olarak kaydedilsin, sonra satıcı istediği açıklamayı oluştursun.
    const description = await this.geminiProvider.generateProductDescription(
      name,
      category,
      keywords,
      tone
    );

    // 2. Ürün nesnesini oluştur ve veritabanına kaydet
    const newProduct = await this.productRepository.create({
      name,
      category,
      keywords,
      description, // AI tarafından oluşturulan açıklama
    });

    return newProduct;
  }
}