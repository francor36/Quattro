// product.controller.js
import { Producto } from '../../models/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();

    // Notificación WebSocket
    const io = req.app.get('io');
    io.emit('producto:cargado', {
      mensaje: `Producto "${nuevoProducto.nombre}" cargado exitosamente`,
      producto: nuevoProducto,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};
