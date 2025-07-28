
import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();
const productController = new ProductController();

// POST /api/products -> Yeni ürün ekler
router.post('/', (req, res) => productController.addProduct(req, res));
router.post('/generate-description', (req, res) => productController.generateProductDescription(req, res));
export { router as productRoutes };