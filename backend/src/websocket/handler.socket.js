const socketHandler = (socket) => {
    socket.on ("message", (data)=> {
        console.log("mensaje recibido", data)

        socket.emit("message", "Su mensaje fue procesado correctamente")
    });

     socket.on("producto_creado", (data) => {
        console.log("Producto creado via socket:", data);
    });

    socket.on ("disconnect", () => {
        console.log(" Usuario desconectado")
    });
};
export default {socketHandler}