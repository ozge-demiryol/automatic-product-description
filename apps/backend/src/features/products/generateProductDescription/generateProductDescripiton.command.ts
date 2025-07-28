import { GeminiAIProvider } from '../../../providers/gemini.provider';
import { GenerateProductDescripitonPayload } from '../../products/generateProductDescription/GenerateProductDescriptionPayload'
import { ProductRepository } from '../product.repository';

export class GenerateProductDescriptionCommandHandler {
    private geminiService: GeminiAIProvider;
    private productRepository: ProductRepository;

    constructor() {
        this.geminiService = new GeminiAIProvider();
        this.productRepository = new ProductRepository();
    }

    async execute(payload: GenerateProductDescripitonPayload): Promise<string> {
        try {
            console.log("Ürün açıklaması Gemini AI ile oluşturuluyor...");
            let description = await this.geminiService.generateProductDescription(payload.name, payload.category, payload.keywords, payload.tone);

            // **Crucial Step: Clean up the response to remove potential markdown wrappers**
            // The AI might still occasionally add these, so we'll explicitly remove them.
            if (description.startsWith('```json')) {
                description = description.substring('```json'.length);
            }
            if (description.endsWith('```')) {
                description = description.substring(0, description.length - '```'.length);
            }

            description = description.trim();
            console.log("Cleaned AI response for parsing:", description);
            const jsonResponse = JSON.parse(description);
            return jsonResponse;
        } catch (jsonError) {
            console.error("Failed to parse AI response as JSON:", jsonError);
            return JSON.stringify({
                seoScore: 0,
                productDescription: "Unable to generate a valid JSON product description. AI response was malformed."
            });
        } 
    }

}