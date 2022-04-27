import express from 'express';
import authController from '../controllers/auth.controller';

import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import messagesRoutes from './messages.routes';
import { Route } from '../types/route.type';

const router = express.Router();

function mergeRoutes(...routeDivisions: Route<any>[][]) {
  const result: Route<any>[] = [];

  routeDivisions.forEach((routes) => {
    routes.forEach((route) => {
      result.push(route);
    });
  });

  return result;
}

const routes = mergeRoutes(authRoutes, usersRoutes, messagesRoutes);

routes.forEach((route) => {
  const handlers = route.handlers.map((handler) => route.main[handler].bind(route.main));
  if (route.authRequired) {
    handlers.unshift(authController.checkAuth.bind(authController));
  }
  router[route.method](route.path, ...handlers);
});

export default router;
