import { Request, Response } from 'express';
import { AddProductCommandHandler } from './commands/addProduct.command';

export class ProductController {
  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, keywords, tone } = req.body;

      if (!name || !category || !keywords) {
        res.status(400).json({ message: 'name, category ve keywords alanları zorunludur.' });
        return;
      }

      const addProductHandler = new AddProductCommandHandler();

      const newProduct = await addProductHandler.execute({ name, category, keywords, tone });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
      res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
  }

  async updateProductDescription(req: Request, res: Response): Promise<void> {
    try {
      const { tone, description, keywords } = req.body;
    } catch (error) {
      console.error("Ürün açıklaması güncellenirken hata oluştu:", error);
    }
  }
}