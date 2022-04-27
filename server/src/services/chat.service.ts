import { Repository } from 'typeorm';
import { db } from '../config/db.config';
import { Message } from '../models/message.model';
import { CreateMessageDto } from '../types/create-message.dto';

export class ChatService {
  constructor(private MessageRepository: Repository<Message>) {}
  createOrUpdate(message: CreateMessageDto | Partial<Message>) {
    return this.MessageRepository.save(message);
  }
  findOne(id: number) {
    return this.MessageRepository.findOne({ where: { id } });
  }
  remove(id: number) {
    return this.MessageRepository.delete({
      id,
    });
  }
}

export default new ChatService(db.getRepository(Message));
