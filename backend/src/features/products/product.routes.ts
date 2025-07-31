
import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();
const productController = new ProductController();

// POST /api/products -> Yeni ürün ekler
router.post('/', (req, res) => productController.addProduct(req, res));
router.post('/generate-description', (req, res) => productController.generateProductDescription(req, res));
router.get('/', (req, res) => productController.getProducts(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));
router.patch('/:id/description', (req, res) => productController.updateProductDescription(req, res));

export { router as productRoutes };