import { Router } from 'express';
import { FaqController } from './faq.controller';

const router = Router({ mergeParams: true });
const faqController = new FaqController();

router.post('/', (req, res) => faqController.addFaq(req, res));
export { router as faqRoutes };