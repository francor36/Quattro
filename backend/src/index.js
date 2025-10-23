import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

//# Vamos a usar esta libreria para los logs
import pkg from 'signale';
//#traemos su clase constructora
const {Signale} = pkg
import AppDataSource from './providers/datasource.provider.js';

//instanciamos la variable app que hace uso de express
const main = () =>{
    //#le damos el scope
    const logger = new Signale ({ scope: 'Main'});
    const port = app.get('port');

 //  Servidor HTTP + Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // en producción: poner URL del frontend
      methods: ['GET', 'POST'],
    },
  });

// Guardamos io en app para usarlo en los controladores
  app.set('io', io);

  // 🔔 Eventos globales de conexión
  io.on('connection', (socket) => {
    logger.success(`Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.warn(`Cliente desconectado: ${socket.id}`);
    });
  });

// Conexión a la base de datos
    AppDataSource.initialize()
    .then(() => logger.log('Connected to Database'))
    .catch(() => logger.log('Unable to connect yo Database'))

// Iniciar servidor HTTP + WebSocket
  server.listen(port, () => {
    logger.start(`Server & WebSocket running on port ${port}`);
  });
};

main();