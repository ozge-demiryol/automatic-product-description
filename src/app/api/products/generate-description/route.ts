import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/app/api/services/aiService';
import { ProductDescriptionRequest } from '@/types/productDescriptionRequest';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const aiService = new AIService();

        console.log("Ürün açıklaması Gemini AI ile oluşturuluyor...");
        const productDescriptionRequest: ProductDescriptionRequest = {
            productName: payload.name,
            category: payload.category,
            keywords: payload.keywords,
            tone: payload.tone
        }

        let description = await aiService.generateProductDescription(productDescriptionRequest);

        if (description.startsWith('```json')) {
            description = description.substring('```json'.length);
        }
        if (description.endsWith('```')) {
            description = description.substring(0, description.length - '```'.length);
        }

        description = description.trim();
        console.log("AI tarafından üretilen açıklama:", description);
        const jsonResponse = JSON.parse(description);
        return NextResponse.json(jsonResponse);

    } catch (error) {
        console.error("Ürün açıklaması üretilerken hata oluştu", error);
        return NextResponse.json({ message: 'Ürün açıklaması üretilerken hata oluştu' }, { status: 500 });
    }
}
