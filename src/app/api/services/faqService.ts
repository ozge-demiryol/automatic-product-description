import { FAQ } from '@/types/faq';
import { WithId, ObjectId } from "mongodb";
import { MongoDataManager } from '../repository/mongoDataManager';

export class FaqService {
    private collectionName = "faqs";
    private mdm = new MongoDataManager<FAQ>();

    async getAllFaqs(): Promise<WithId<FAQ>[]> {
        return await this.mdm.find(this.collectionName);
    }

    async getFaqById(id: string): Promise<WithId<FAQ> | null> {
        const objectId = new ObjectId(id);
        return await this.mdm.findOne(this.collectionName, {
            _id: objectId,
        });
    }

    async deleteFaq(id: string): Promise<boolean> {
        const objectId = new ObjectId(id);
        return await this.mdm.deleteOne(this.collectionName, { _id: objectId });
    }

    async createFaq(faqData: Partial<FAQ>): Promise<WithId<FAQ>> {
        const newFaq = { ...faqData, createdAt: new Date() } as FAQ;
        return await this.mdm.insertOne(this.collectionName, newFaq);
    }

    async updateFaq(id: string, faqData: Partial<FAQ>): Promise<boolean> {
        const objectId = new ObjectId(id);
        return await this.mdm.updateOne(this.collectionName, { _id: objectId }, faqData);
    }

    async getFaqsByProductId(productId: string): Promise<WithId<FAQ>[]> {
        const objectId = new ObjectId(productId);
        return await this.mdm.find(this.collectionName, { productId: objectId });
    }

    async findClosestFaqs(
        productId: string,
        queryEmbedding: number[],
        limit: number = 3
    ): Promise<FAQ[]> {
        try {
            const faqs = await this.mdm.aggregate<FAQ>(this.collectionName, [
                {
                    $vectorSearch: {
                        queryVector: queryEmbedding,
                        path: 'embedding',
                        numCandidates: 100,
                        limit: limit,
                        index: 'vector_index_faq',
                        filter: {
                            productId: new ObjectId(productId),
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        question: 1,
                        answer: 1,
                        score: { $meta: 'vectorSearchScore' },
                    },
                },
            ]);
            return faqs;
        } catch (error) {
            console.error('Error during FAQ vector search:', error);
            return [];
        }
    }
}
