import { io } from "socket.io-client";

// URL de tu backend
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
