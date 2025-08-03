import { Router } from 'express';
import { ChatController } from './chat.controller';

const router = Router();
const chatController = new ChatController();

router.post('/', (req, res) => chatController.getChatResponse(req, res));

export { router as chatRoutes };