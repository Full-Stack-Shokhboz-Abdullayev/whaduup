import { Response } from 'express';
import { Repository } from 'typeorm';
import { db } from '../config/db.config';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { ExtendedRequest } from './auth.controller';

export class MessagesController {
  constructor(private MessageRepository: Repository<Message>) {}
  async messages(req: ExtendedRequest, res: Response) {
    try {
      const { to }: { to: User } = req.body;
      const { password: _, ...from } = req.user;

      const messages = await this.MessageRepository.query(`
      SELECT * FROM messages WHERE 
      "fromId" = '${from.id}' AND "toId" = '${to.id}' OR "fromId" = '${to.id}' AND "toId" = '${from.id}';
    `);

      const hydratedMessages = messages.map((message: Message & { fromId: number; toId: number }) => {
        return { ...message, from: message.fromId === from.id ? from : to, to: message.toId === from.id ? from : to };
      }) as Message[];

      res.status(200).json({
        success: true,
        messages: hydratedMessages,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new MessagesController(db.getRepository(Message));
