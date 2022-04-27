import { config } from 'dotenv';
config();

import express from 'express';
import { join } from 'path';
import { onDatabaseReady } from './config/db.config';
import { createServer } from 'http';
import SocketIO from 'socket.io';
import { SocketGateway } from './gateways';
import cors, { CorsOptions } from 'cors';
import router from './router';

const corsOptions: CorsOptions = {
  origin: '*',
};

async function main() {
  const app = express();

  // express middlewares
  app.use(express.json());
  app.use('/uploads', express.static(join(__dirname, 'uploads')));
  app.use(cors(corsOptions));

  // rest api router
  app.use(router);

  const port = process.env.PORT || 3000;
  const server = createServer(app);

  const io = new SocketIO.Server(server, {
    cors: corsOptions,
  });

  SocketGateway.init(io);
  server.listen(port, () => {
    console.log(`🚀 App listening on port ${port}...`);
  });
}

onDatabaseReady(main);
