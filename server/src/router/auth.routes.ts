import authController, { AuthController } from '../controllers/auth.controller';
import { Route } from '../types/route.type';

const routes: Route<AuthController>[] = [
  {
    path: '/login',
    method: 'post',
    main: authController,
    handlers: ['login'],
  },
  {
    path: '/register',
    method: 'post',
    main: authController,
    handlers: ['register'],
  },
  {
    path: '/refresh',
    method: 'get',
    main: authController,
    authRequired: true,
    handlers: ['refresh'],
  },
];

export default routes;
