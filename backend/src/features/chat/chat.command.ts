import { GetChatResponseCommandPayload } from './GetChatResponseCommandPayload';
import { GeminiAIProvider } from '../../providers/gemini.provider';
import { ProductRepository } from '../products/product.repository';
import { FaqRepository } from '../../features/faq/faq.repository';
import { Content } from '@google/generative-ai';
import { IFAQ } from '../../features/faq/faq.model';

export class GetChatResponseCommandHandler {
  private geminiProvider: GeminiAIProvider;
  private productRepository: ProductRepository;
  private faqRepository: FaqRepository;

  constructor() {
    this.geminiProvider = new GeminiAIProvider();
    this.productRepository = new ProductRepository();
    this.faqRepository = new FaqRepository(); 
  }

  async execute(payload: GetChatResponseCommandPayload): Promise<string> {
    const { messages: originalMessages, productId } = payload;
    const messages = [...originalMessages];

    const product = await this.productRepository.findById(productId);

    if (!product) {
      return 'Ürün bilgileri bulunamadı.';
    }
    const productContext = `
    Ürün Adı: ${product.name}
    Açıklama: ${product.description}
    Fiyat: ${product.price}
    Kategori: ${product.category}
    `.trim();

    const baseSystemInstruction = `Sen bir e-ticaret ürün asistanısın.
    Müşterilerin aşağıda bilgileri verilen ürünle ilgili iade koşulları, garanti, kargo süreleri, ürün özellikleri gibi sorularını yanıtla.
    Bilgin dahilinde, nazik ve yardımcı olmaya çalış.
    Cevaplarını bu bilgilere dayandır ve uydurma yanıtlar üretme.
    Eğer sana sağlanan bilgilerden bir çözüm bulamıyorsan, uydurma bir yanıt vermek yerine müşteri temsilcisine yönlendirebilirsin.`;

    const lastUserMessage = messages.pop();
    if (!lastUserMessage || lastUserMessage.role !== 'user') {
      return 'Geçerli bir kullanıcı mesajı bulunamadı.';
    }

    const userQueryEmbedding = await this.geminiProvider.createEmbeddings(
      lastUserMessage.content
    );

    let relevantFAQs: IFAQ[] = [];
    if (userQueryEmbedding.length > 0) {
      relevantFAQs = await this.faqRepository.findClosestFAQs(
        productId,
        userQueryEmbedding,
        5 // En fazla 5 alakalı SSS getir
      );
    }

    console.log(relevantFAQs);

    let faqContext = '';
    if (relevantFAQs.length > 0) {
      faqContext = `
      --- SIKÇA SORULAN SORULAR (SSS) ---
      Aşağıda bu ürünle ilgili sıkça sorulan bazı sorular ve yanıtları bulunmaktadır. 
      Lütfen bu bilgileri müşterinin sorusunu yanıtlarken kullanın:
      ${relevantFAQs
        .map((faq, index) => `${index + 1}. Soru: ${faq.question}\nYanıt: ${faq.answer}`)
        .join('\n\n')}
      ---
      `;
    }

    const fullSystemInstruction = `${baseSystemInstruction}

    --- ÜRÜN BİLGİLERİ ---
    ${productContext}
    ---

    ${faqContext}
    `;

    const history: Content[] = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    try {
      const chatSession = this.geminiProvider.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: fullSystemInstruction }],
          },
          {
            role: 'model',
            parts: [{ text: 'Merhaba! Size nasıl yardımcı olabilirim?' }],
          },
          ...history,
        ],
      });
      const result = await chatSession.sendMessage(lastUserMessage.content);
      const response = await result.response.text();
      return response;
    } catch (error) {
      console.error('Gemini AI yanıtı alınırken hata:', error);
      throw new Error('Yapay zeka servisinden yanıt alınamadı.');
    }
  }
}