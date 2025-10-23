import { io } from "socket.io-client";

// Conectarse al servidor WebSocket
const socket = io("http://localhost:3000");

// Cuando se conecta
socket.on("connect", () => {
  console.log("✅ Conectado al servidor WebSocket con id:", socket.id);
});

// Escuchar evento de producto cargado
socket.on("producto:cargado", (data) => {
  console.log("🔔 Producto cargado:", data);
});

// Escuchar evento de usuario iniciando sesión
socket.on("usuario:inicio", (data) => {
  console.log("👤 Usuario inició sesión:", data);
});

// Cuando se desconecta
socket.on("disconnect", () => {
  console.log("⚠️ Desconectado del servidor WebSocket");
});
