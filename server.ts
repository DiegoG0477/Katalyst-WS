import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { WebSocketHandler } from './src/handler/socket.handler';
import { socketioAuthMiddleware } from './src/middlewares/auth.middleware';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
      origin: '*'
  },
  pingInterval: 1000,
  pingTimeout: 2000
});

io.use(socketioAuthMiddleware);

const websocketHandler = new WebSocketHandler(io);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});
