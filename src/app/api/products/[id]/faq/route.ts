import { NextRequest, NextResponse } from 'next/server';
import { FaqService } from '@/app/api/services/faqService';
import { AIService } from '@/app/api/services/aiService';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const faqService = new FaqService();
        const faqs = await faqService.getFaqsByProductId(id);
        return NextResponse.json(faqs);
    } catch (error) {
        console.error("Ürün soruları getirilirken hata oluştu:", error);
        return NextResponse.json({ message: 'Ürün soruları getirilirken hata oluştu' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { question, answer } = await req.json();

        if (!question || !answer) {
            return NextResponse.json({ message: 'Sorular ve cevaplarının girilmesi zorunludur' }, { status: 400 });
        }

        const aiService = new AIService();
        const faqService = new FaqService();

        const combinedText = `${question} ${answer}`;
        const embedding = await aiService.createEmbeddings(combinedText);

        const newFaq = await faqService.createFaq({
            productId: new ObjectId(id),
            question,
            answer,
            embedding,
            chunkText: combinedText,
        });

        return NextResponse.json(newFaq, { status: 201 });

    } catch (error) {
        console.error("Soru eklenirken hata oluştu:", error);
        return NextResponse.json({ message: 'Soru eklenirken hata oluştu' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { question, answer } = await req.json();

        if (!question && !answer) {
            return NextResponse.json({ message: 'Güncelleme için soru veya cevap gereklidir' }, { status: 400 });
        }

        const faqService = new FaqService();
        const existingFaq = await faqService.getFaqById(id);

        if (!existingFaq) {
            return NextResponse.json({ message: 'Soru bulunamadı' }, { status: 404 });
        }

        const updatedData = { ...existingFaq, ...{ question, answer } };

        if (question || answer) {
            const aiService = new AIService();
            const combinedText = `${updatedData.question} ${updatedData.answer}`;
            const embedding = await aiService.createEmbeddings(combinedText);
            updatedData.embedding = embedding;
            updatedData.chunkText = combinedText;
        }

        const success = await faqService.updateFaq(id, updatedData);

        if (success) {
            return NextResponse.json({ message: 'SSS başarıyla güncellendi' });
        } else {
            return NextResponse.json({ message: 'SSS güncellenemedi' }, { status: 500 });
        }

    } catch (error) {
        console.error("SSS güncellenirken hata oluştu:", error);
        return NextResponse.json({ message: 'SSS güncellenirken hata oluştu' }, { status: 500 });
    }
}