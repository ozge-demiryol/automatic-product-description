import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { GetChatResponseCommandHandler } from './chat.command';
import { GetChatResponseCommandPayload } from './GetChatResponseCommandPayload';

export class ChatController {
  async getChatResponse(req: Request, res: Response): Promise<void> {
    try {
      const validationError = this.validateInput(req.body);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const { messages, productId } = req.body;

      const handler = new GetChatResponseCommandHandler();
      const payload: GetChatResponseCommandPayload = {
        messages,
        // sellerId: new Types.ObjectId(sellerId),
        productId: new Types.ObjectId(productId),
      };
      const responseText = await handler.execute(payload);

      res.status(200).json({ message: responseText });
    } catch (error) {
      console.error('Chat controller error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  private validateInput(body: { messages: unknown; productId: unknown; sellerId: unknown }): string | null {
    // if (!body.sellerId || !Types.ObjectId.isValid(body.sellerId as string)) {
    //   return 'A valid Seller ID is required.';
    // }
    if (!body.productId) {
      return 'A valid Product ID is required.';
    }
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return 'Messages array is required.';
    }
    return null;
  }
}