import { Message } from '../models/message.model';

export type CreateMessageDto = Omit<Message, 'id' | 'updated' | 'createdAt'>;
