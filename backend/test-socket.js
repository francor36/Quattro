import { io } from "socket.io-client";

// Conectarse al servidor WebSocket
const socket = io("http://localhost:3000");

// Cuando se conecta
socket.on("connect", () => {
  console.log("✅ Conectado al servidor WebSocket con id:", socket.id);

  // Enviar evento de prueba "message"
  socket.emit("message", "Hola desde el cliente!");

  // Enviar evento "producto:cargado"
  socket.emit("producto:cargado", { nombre: "Manzana", precio: 120 });

  // Enviar evento "usuario:inicio"
  socket.emit("usuario:inicio", { usuario: "vane", hora: new Date() });
});

// Escuchar evento de mensaje del servidor
socket.on("message", (data) => {
  console.log("📨 Mensaje del servidor:", data);
});

// Escuchar evento de producto cargado
socket.on("producto:cargado", (data) => {
  console.log("🔔 Producto cargado recibido desde servidor:", data);
});

// Escuchar evento de usuario iniciando sesión
socket.on("usuario:inicio", (data) => {
  console.log("👤 Usuario inició sesión recibido desde servidor:", data);
});

// Cuando se desconecta
socket.on("disconnect", () => {
  console.log("⚠️ Desconectado del servidor WebSocket");
});
