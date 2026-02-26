import AppDataSource from "../../providers/datasource.provider.js";

const orderRepo = AppDataSource.getRepository("Order");
const orderDetailRepo = AppDataSource.getRepository("OrderDetail");
const productRepo = AppDataSource.getRepository("Product");

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    // Capturamos los items que envías desde checkout.vue
    const { items } = req.body; 

    // Validación: Si no hay items en el body, lanzamos el error
    if (!items || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "El carrito está vacío (no se recibieron items)",
      });
    }

    let totalAmount = 0;
    const detailsToSave = [];

    // Validamos cada producto contra la DB para evitar fraudes de precios
    for (const item of items) {
      const product = await productRepo.findOne({ where: { id: item.product_id } });
      
      if (!product) {
        return res.status(404).json({ ok: false, message: `Producto ${item.product_id} no existe` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ ok: false, message: `No hay stock de ${product.name}` });
      }

      totalAmount += Number(product.price) * item.quantity;
      detailsToSave.push({
        product: product,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Creamos la orden
    const order = orderRepo.create({
      user: { id: userId },
      total_amount: totalAmount,
      status: "pending",
    });

    const savedOrder = await orderRepo.save(order);

    // Creamos los detalles
    for (const detail of detailsToSave) {
      const orderDetail = orderDetailRepo.create({
        order: savedOrder,
        product: detail.product,
        quantity: detail.quantity,
        price: detail.price,
      });
      await orderDetailRepo.save(orderDetail);
    }

    // Respuesta que espera tu Frontend
    return res.json({
      ok: true,
      message: "Orden creada correctamente",
      order_id: savedOrder.id, // <-- Asegúrate de que checkout.vue use este nombre
    });

  } catch (error) {
    console.error("Error al crear orden:", error);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
};

export const orderController = { createOrder };