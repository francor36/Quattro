import app from './app.js';
import pkg from 'signale';
import AppDataSource from './providers/datasource.provider.js';
//socket
import http from 'http';
import { Server } from 'socket.io';
import { envs } from './configurations/envs.js';
import handlerSocket from './websocket/handler.socket.js';

const socketHandler = handlerSocket
const {Signale} = pkg;

const main = () => {
    const logger = new Signale({ scope: 'Main' });
    const port = app.get('port');

    const server = http.createServer(app);
    
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Conexión a la base de datos
    AppDataSource.initialize()
        .then(() => logger.success('Connected to Database'))
        .catch((error) => logger.error('Unable to connect to Database:', error));

    // aca se configuran los eventos socket.io
    io.on("connection", (socket) => {
        logger.success(`Usuario conectado: ${socket.id}`);

        socketHandler.socketHandler(socket)
        
        socket.on('disconnect', () => {
            logger.info(`Usuario desconectado: ${socket.id}`);
        });
    });

    // Guardar io en app para usar en rutas si es necesario
    app.set('io', io);

    server.listen(port, () => {
        logger.success(`Server & WebSocket running on port ${envs.PORT}`);
    });
};

main();
