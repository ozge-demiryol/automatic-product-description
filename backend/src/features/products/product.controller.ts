import { Request, Response } from 'express';
import { AddProductCommandHandler } from './addProduct/addProduct.command';
import { GenerateProductDescriptionCommandHandler } from './generateProductDescription/generateProductDescripiton.command';
import { ProductRepository } from './product.repository';
import { Types } from 'mongoose';

export class ProductController {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, keywords, description, price } = req.body;

      if (!name || !category || !keywords) {
        res.status(400).json({ message: 'name, category ve keywords alanları zorunludur.' });
        return;
      }

      const addProductHandler = new AddProductCommandHandler();

      const newProduct = await addProductHandler.execute({ name, category, keywords, description, price });

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
      if (!id || !description) {
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
    try {
      const {name, category, tone, keywords } = req.body;
      if (!name || !category || !tone || !keywords) {
        res.status(400).json({ message: 'name, category, tone ve keywords alanları zorunludur.' });
        return;
      }

      const generateProductDescriptionHandler = new GenerateProductDescriptionCommandHandler();

      const description = await generateProductDescriptionHandler.execute({ name, category, tone, keywords });

      res.status(201).json(description);
    } catch (error) {
      console.error("Ürün açıklaması oluşturulurken hata oluştu:", error);
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findAll();
      res.json(products);
    } catch (error) {
      console.error("Ürünler alınırken hata oluştu:", error);
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Geçersiz ürün IDsi.' });
        return;
      }

      const objectId = new Types.ObjectId(id);
      const product = await this.productRepository.findById(objectId);

      if (!product) {
        res.status(404).json({ message: 'Ürün bulunamadı.' });
        return;
      }
      res.json(product);
    } catch (error) {
      console.error("Ürün alınırken hata oluştu:", error);
      res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
  }
}