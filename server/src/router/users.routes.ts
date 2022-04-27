import usersController, { UsersController } from '../controllers/users.controller';
import { Route } from '../types/route.type';

const routes: Route<UsersController>[] = [
  {
    path: '/users',
    method: 'get',
    authRequired: true,
    main: usersController,
    handlers: ['users'],
  },
  {
    path: '/users/:username',
    method: 'get',
    authRequired: true,
    main: usersController,
    handlers: ['user'],
  },
];

export default routes;
