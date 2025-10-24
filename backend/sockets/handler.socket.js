// backend/src/sockets/handler.socket.js
// Maneja todos los eventos de Socket.IO
export const socketHandler = (socket,io, logger) => {
  // Evento de prueba desde el cliente
  socket.on("message", (data) => {
    logger.log("📨 Mensaje recibido:", data);
  });

  // Evento producto cargado
  socket.on("producto:cargado", (data) => {
    logger.log("🔔 Producto cargado:", data);
     io.emit("producto:cargado", data); // reenvía a todos los clientes
  });

  // Evento usuario inició sesión
  socket.on("usuario:inicio", (data) => {
    logger.log("👤 Usuario inició sesión:", data);
     io.emit("usuario:inicio", data); // reenvía a todos los clientes
  });

  // Desconexión
  socket.on("disconnect", () => {
    logger.warn(`Usuario desconectado: ${socket.id}`);
  });
};
