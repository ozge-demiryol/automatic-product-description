import { Types } from 'mongoose';
import { FAQModel, IFAQ } from './faq.model';
import { RepositoryBase } from '../base.repository';

export class FaqRepository implements RepositoryBase<IFAQ> {
  async findAll(): Promise<IFAQ[]> {
    return await FAQModel.find().exec();
  }
  async findById(id: Types.ObjectId): Promise<IFAQ | null> {
    return await FAQModel.findById(id).exec();
  }
  async delete(id: Types.ObjectId): Promise<IFAQ | null> {
    return await FAQModel.findByIdAndDelete(id).exec();
  }
  async create(faqData: Partial<IFAQ>): Promise<IFAQ> {
    const product = new FAQModel(faqData);
    return await product.save();
  }

  async update(faqData: Partial<IFAQ>): Promise<IFAQ | null> {
    return await FAQModel.findByIdAndUpdate(faqData._id, faqData, { new: true });
  }

  async findClosestFAQs(
    productId: Types.ObjectId,
    queryEmbedding: number[],
    limit: number = 3
  ): Promise<IFAQ[]> {
    // MongoDB'nin aggregation framework'ünü kullanarak vektör benzerliği araması yapalım
    // Bu, MongoDB Atlas Vector Search veya uygun bir vektör arama eklentisi kullanıyorsanız geçerlidir.
    // Eğer sadece lokal bir MongoDB kullanıyorsanız ve vektör arama yeteneği yoksa,
    // basit bir euclidean/cosine mesafe hesaplaması ile elle filtreleme yapmanız gerekebilir.
    // Şimdilik, vektör arama yeteneğine sahip olduğunuzu varsayalım.

    // Not: Bu, spesifik MongoDB Atlas Vector Search indeksleme ve sorgulama yapısına bağlıdır.
    // Kendi indeks ayarlarınıza göre 'vector_index' ve 'embedding' alanlarını ayarlamanız gerekebilir.
    try {
      const faqs = await FAQModel.aggregate([
        {
          $vectorSearch: {
            queryVector: queryEmbedding,
            path: 'embedding', // FAQ modelindeki embedding alanının adı
            numCandidates: 100, // Aranacak aday sayısı
            limit: limit, // Döndürülecek sonuç sayısı
            index: 'vector_index_faq', // MongoDB Atlas'taki vektör indeksinin adı
            filter: {
              productId: productId,
            },
          },
        },
        {
          $project: {
            question: 1,
            answer: 1,
            score: { $meta: 'vectorSearchScore' }, // Skor alanını döndür
          },
        },
      ]);
      return faqs;
    } catch (error) {
      console.error('FAQ arama hatası:', error);
      // Hata durumunda boş bir dizi veya uygun bir hata fırlatabiliriz.
      return [];
    }
  }
}