import { GeminiAIProvider } from "../../providers/gemini.provider";
import { AddFaqCommandPayload } from "./AddFaqCommandPayload";
import { IFAQ } from "./faq.model";
import { FaqRepository } from "./faq.repository";

export class AddFaqCommandHandler {
  private readonly faqRepository: FaqRepository;
  private readonly geminiAiProvider: GeminiAIProvider;

  constructor() {
    this.faqRepository = new FaqRepository();
    this.geminiAiProvider = new GeminiAIProvider();
  }

  async execute(payload: AddFaqCommandPayload): Promise<IFAQ> {
    const { productId, question, answer } = payload;

    const combinedText = `${question} ${answer}`;
    console.log(combinedText);

    //Soru ve cevap metinlerini birleştirip tek metin haline getirmek
    //anlamsal arama (semantic search) konusunda daha tutarlı sonuçlar getirir
    //Bu yüzden ürün soru ve cevaplarını chunkText diye bir alanda tutuyoruz
    const embedding = await this.geminiAiProvider.createEmbeddings(combinedText);
    console.log(embedding);

    return this.faqRepository.create({
      productId,
      question,
      answer,
      embedding,
      chunkText: combinedText,
    });
  }
}