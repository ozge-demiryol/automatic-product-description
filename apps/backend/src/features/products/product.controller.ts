import { Request, Response } from 'express';
import { AddProductCommandHandler } from './addProduct/addProduct.command';
import { GenerateProductDescriptionCommandHandler } from './generateProductDescription/generateProductDescripiton.command';

export class ProductController {
  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, keywords, tone } = req.body;

      if (!name || !category || !keywords) {
        res.status(400).json({ message: 'name, category ve keywords alanları zorunludur.' });
        return;
      }

      const addProductHandler = new AddProductCommandHandler();

      const newProduct = await addProductHandler.execute({ name, category, keywords });

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
      const { id, description } = req.body;
      if (!id || !description ) {
        res.status(400).json({ message: 'name, category ve keywords alanları zorunludur.' });
        return;
      }

      //const generateProductDescriptionHandler = new upda();

      //const newProduct = await this.updateProductDescription.execute({ id, description });

      //res.status(201).json(newProduct);
    } catch (error) {
      console.error("Ürün açıklaması güncellenirken hata oluştu:", error);
    }
  }

  async generateProductDescription(req: Request, res: Response): Promise<void> {
    try{
      const { id, name, category, tone, keywords } = req.body;
      if (!id || !tone || !keywords) {
        res.status(400).json({ message: 'name, category, tone ve keywords alanları zorunludur.' });
        return;
      }

      const generateProductDescriptionHandler = new GenerateProductDescriptionCommandHandler();

      const description = await generateProductDescriptionHandler.execute({ id, name, category, tone, keywords });

      res.status(201).json(description);
    } catch (error) {
      console.error("Ürün açıklaması oluşturulurken hata oluştu:", error);
    }
  }
  async deleteProduct(req: Request, res: Response): Promise<void> {
  }
}