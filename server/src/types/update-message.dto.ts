import { Message } from '../models/message.model';
import { PartialBy } from './partial-by.type';

export type UpdateMessageDto = PartialBy<Message, 'updated' | 'file' | 'text' | 'createdAt'> & {
  sendTo: string;
};
