import { Request, Response } from 'express';
import { AddFaqCommandHandler } from './addFaq.command';
import { Types } from 'mongoose';

export class FaqController {
  private addFaqCommandHandler: AddFaqCommandHandler;

  constructor() {
    this.addFaqCommandHandler = new AddFaqCommandHandler();
  }

  async addFaq(req: Request, res: Response): Promise<void> {
    try {
      const { id: productId } = req.params;
      const { question, answer } = req.body;

      if (!Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: 'Geçersiz ürün IDsi.' });
        return;
      }

      if (!question || !answer) {
        res.status(400).json({ message: 'Soru ve cevap alanları zorunludur.' });
        return;
      }

      const newFaq = await this.addFaqCommandHandler.execute({
        productId: new Types.ObjectId(productId),
        question,
        answer,
      });

      res.status(201).json(newFaq);
    } catch (error) {
      console.error('SSS eklenirken hata oluştu:', error);
      res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
  }
}