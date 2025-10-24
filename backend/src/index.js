import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from '../sockets/handler.socket.js';
import AppDataSource from './providers/datasource.provider.js';
import pkg from 'signale';

const { Signale } = pkg;

const main = () => {
  const logger = new Signale({ scope: 'Main' });
  const port = app.get('port');

  // Crear servidor HTTP
  const server = http.createServer(app);

  // Instanciar Socket.IO con CORS permitido para cualquier origen
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Guardar io en app para usar en los controladores
  app.set('io', io);

  // Conexión a la base de datos
  AppDataSource.initialize()
    .then(() => logger.success('Connected to Database'))
    .catch(() => logger.error('Unable to connect to Database'));

  // Manejar conexiones de Socket.IO
  io.on('connection', (socket) => {
    logger.success(`Cliente conectado: ${socket.id}`);
    socketHandler(socket,io, logger);
  });

  // Iniciar servidor
  server.listen(port, () => {
    logger.start(`Server & WebSocket running on port ${port}`);
  });
};

main();
