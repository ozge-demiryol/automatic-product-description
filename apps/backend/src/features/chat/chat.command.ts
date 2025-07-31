import { GetChatResponseCommandPayload } from './GetChatResponseCommandPayload';
import { GeminiAIProvider } from '../../providers/gemini.provider';
import { ProductRepository } from '../products/product.repository';
import { Content } from '@google/generative-ai';

export class GetChatResponseCommandHandler {
  private geminiProvider: GeminiAIProvider;
  private productRepository: ProductRepository;

  constructor() {
    this.geminiProvider = new GeminiAIProvider();
    this.productRepository = new ProductRepository();
  }

  async execute(payload: GetChatResponseCommandPayload): Promise<string> {
    const { messages, productId } = payload;

    const product = await this.productRepository.findById(productId);

    if (!product) {
      return "Ürün bilgileri bulunamadı.";
    }

    const history: Content[] = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    try {
      const chatSession = this.geminiProvider.startChat({ history: history });

      const lastUserMessage = messages[messages.length - 1]?.content;

      if (!lastUserMessage) {
        return "Geçerli bir mesaj bulunamadı.";
      }

      const result = await chatSession.sendMessage(lastUserMessage);
      const response = await result.response;
      const responseText = response.text();

      return responseText;
    } catch (error) {
      console.error('Gemini AI yanıtı alınırken hata:', error);
      if (error instanceof Error) {
        console.error('Hata mesajı:', error.message);
        console.error('Hata yığını:', error.stack);
      }
      throw error;
    }
  }
}