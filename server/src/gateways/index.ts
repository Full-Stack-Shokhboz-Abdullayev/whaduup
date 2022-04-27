import { Server, Socket } from 'socket.io';
import { User } from '../models/user.model';
import chatService, { ChatService } from '../services/chat.service';
import SocketIOFileUpload from 'socketio-file-upload';
import { join } from 'path';
import { deleteFromUploads } from '../utils/file.utils';
import { CreateMessageDto } from '../types/create-message.dto';
import { UpdateMessageDto } from '../types/update-message.dto';

const BASE_URL = process.env.UPLOADS_URL || `http://localhost:${process.env.PORT || 3000}/uploads/`;
export class SocketGateway {
  private chats = new Map<string, Socket>();
  constructor(private socket: Socket, private chatService: ChatService) {}
  public handleConnection() {
    const uploader = new SocketIOFileUpload();
    uploader.dir = join(__dirname, '..', 'uploads');

    uploader.listen(this.socket);
    console.log('SocketIOFileUpload listening');

    uploader.on('saved', async (event: any) => {
      const message = event.file.meta.message;

      if (message.id) {
        const found = await this.chatService.findOne(message.id);
        if (found) {
          if (found.file) {
            deleteFromUploads(found.file, BASE_URL);
          }
          await this['_update-message']({ ...message, file: BASE_URL + event.file.name });
        }
      } else {
        await this['_send-message']({ ...message, file: BASE_URL + event.file.name });
      }
    });
  }
  handleDisconnection() {}

  '_chat-connected'({ username }: Pick<User, 'username'>) {
    console.log(`${username} connected`);
    this.socket.join(username);
  }
  '_chat-disconnected'({ username }: Pick<User, 'username'>) {
    console.log(`${username} disconnected`);
    this.socket.leave(username);
  }

  public async '_send-message'(createMessageDto: CreateMessageDto) {
    const message = await this.chatService.createOrUpdate(createMessageDto);
    this.socket.emit('message-sent', message);
    this.socket.to(createMessageDto.to.username).emit('message-sent', message);
  }

  async '_update-message'({ to, from, ...updateMessageDto }: UpdateMessageDto) {
    const message = await this.chatService.createOrUpdate({ ...updateMessageDto, updated: true });
    this.socket.emit('message-updated', { ...message, from, to });
    this.socket.to(to.username).emit('message-updated', { ...message, from, to });
  }
  async '_delete-message'({ id, to, file }: { id: number; to: User; file: string }) {
    if (file) {
      deleteFromUploads(file, BASE_URL);
    }
    await this.chatService.remove(id);
    this.socket.to(to.username).emit('message-deleted', id);
  }

  public static init(io: Server) {
    io.on('connection', (socket: Socket) => {
      const instance = new SocketGateway(socket, chatService);
      instance.handleConnection();

      Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach((key) => {
        if (key.startsWith('_')) {
          const e = key.substring(1);
          socket.on(e, (instance as any)[key].bind(instance));
        }
      });

      socket.on('disconnect', () => {
        instance.handleDisconnection();
      });
    });
  }
}
