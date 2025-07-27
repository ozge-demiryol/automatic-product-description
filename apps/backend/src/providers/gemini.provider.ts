import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './AIProvider';

export class GeminiAIProvider implements AIProvider {
    private genAI: GoogleGenerativeAI;
    private model: string = "gemini-2.5-flash";

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY ortam değişkeni bulunamadı.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateProductDescription(
        productName: string,
        category: string,
        keywords: string[],
        tone: string
    ): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.model });

            const prompt = `E-commerce and SEO expert assistant. Your task is to write an engaging and SEO-friendly product description for an e-commerce website based on the following information:
        - Product Name: ${productName}
        - Category: ${category}
        - Keywords: ${keywords.join(', ')}

        The description should highlight the product's features and benefits and have a ${tone} tone.
        The description should be in Turkish.
        The SEO score of the description must be at least 90.

        Return ONLY the JSON object, without any surrounding text, markdown formatting (like triple backticks), or conversational filler. The format must be:
        {
            "seoScore": number,
            "productDescription": string
        }`;

            const result = await model.generateContent(prompt);
            const response = await result.response.text();
            console.log(response)
            return response;
        } catch (error) {
            console.error("Gemini AI açıklaması oluşturulurken hata oluştu:", error);
            return "Bu ürün için otomatik açıklama oluşturulamadı.";
        }
    }
}

// export class GeminiAIProvider implements AIProvider {
//     private model: any = 'gemini-2.5-flash';
//     private apiKey: string;

//     constructor(apiKey: string) {
//         this.apiKey = apiKey;
//         const genAI = new GoogleGenerativeAI(this.apiKey);
//         this.model = genAI.getGenerativeModel({ model: this.model });
//     }
//     async generateProductDescription(tone: string): Promise<string> {
//         const prompt = `${tone}`;

//         try {
//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
//             const summary = response.text();
//             return summary;
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//             throw new Error(`Gemini product description generation failed: ${errorMessage}`);
//         }
//     }
// } 