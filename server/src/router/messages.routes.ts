import messagesController, { MessagesController } from '../controllers/messages.controller';
import { Route } from '../types/route.type';

const routes: Route<MessagesController>[] = [
  {
    path: '/messages',
    method: 'post',
    authRequired: true,
    main: messagesController,
    handlers: ['messages'],
  },
];

export default routes;
