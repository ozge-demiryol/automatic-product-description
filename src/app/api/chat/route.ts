import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '../services/aiService';
import { Content } from '@google/generative-ai';
import { FAQ } from '@/types/faq';
import { ProductService } from '../services/productService';
import { FaqService } from '../services/faqService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatRequestBody {
    messages: Message[];
    productId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequestBody = await request.json();
        const { messages: originalMessages, productId } = body;

        // Validate request body
        if (!originalMessages || !Array.isArray(originalMessages) || !productId) {
            return NextResponse.json(
                { error: 'Geçersiz istek formatı. Messages ve productId gereklidir.' },
                { status: 400 }
            );
        }

        const messages = [...originalMessages];

        const aiService = new AIService();
        const productService = new ProductService();
        const faqService = new FaqService();
        const product = await productService.getProductById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Ürün bilgileri bulunamadı.' },
                { status: 404 }
            );
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

        // Get the last user message
        const lastUserMessage = messages.pop();
        if (!lastUserMessage || lastUserMessage.role !== 'user') {
            return NextResponse.json(
                { error: 'Geçerli bir kullanıcı mesajı bulunamadı.' },
                { status: 400 }
            );
        }

        // Create embeddings for user query
        const userQueryEmbedding = await aiService.createEmbeddings(
            lastUserMessage.content
        );

        // Find relevant FAQs
        let relevantFAQs: FAQ[] = [];
        if (userQueryEmbedding.length > 0) {
            relevantFAQs = await faqService.findClosestFaqs(
                productId,
                userQueryEmbedding,
                5 // En fazla 5 alakalı SSS getir
            );
        }

        console.log(relevantFAQs);

        // Ürünle alakalı sorulan sorular için context oluştur
        let faqContext = '';
        if (relevantFAQs.length > 0) {
            faqContext = `
      --- SIKÇA SORULAN SORULAR (SSS) ---
      Aşağıda bu ürünle ilgili sıkça sorulan bazı sorular ve yanıtları bulunmaktadır. 
      Lütfen bu bilgileri müşterinin sorusunu yanıtlarken kullanın:
      ${relevantFAQs.map((faq, index) => `${index + 1}. Soru: ${faq.question}\nYanıt: ${faq.answer}`).join('\n\n')}
      Eğer bir ürün için müşteri değişim ya da iade talep ederse ama bu ürün için değişim ve iade mümkün değilse
      Müşterinin hesabına ürün tutarı kadar hediye kupon tanımla.
      ---
      `;
        }

        const fullSystemInstruction = `${baseSystemInstruction}

    --- ÜRÜN BİLGİLERİ ---
    ${productContext}
    ---

    ${faqContext}
    `;

        // Convert messages to Gemini format
        const history: Content[] = messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Start chat session and get response
        const chatSession = aiService.startChat({
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

        return NextResponse.json({
            message: response,
            success: true
        });

    } catch (error) {
        console.error('Gemini AI yanıtı alınırken hata:', error);

        return NextResponse.json(
            {
                error: 'Yapay zeka servisinden yanıt alınamadı.',
                success: false
            },
            { status: 500 }
        );
    }
}