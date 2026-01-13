import AppDataSource from "../../providers/datasource.provider.js";

const cartRepo = AppDataSource.getRepository("ShoppingCart");
const orderRepo = AppDataSource.getRepository("Order");
const orderDetailRepo = AppDataSource.getRepository("OrderDetail");
const cartItemRepo = AppDataSource.getRepository("CartItem");

/**
 * Crear orden a partir del carrito del usuario
 * - Valida stock
 * - Congela precios
 * - NO descuenta stock
 * - Estado inicial: pending
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Obtener carrito con productos
    const cart = await cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "El carrito está vacío",
      });
    }

    // 2️⃣ Calcular total (SIEMPRE desde DB)
    let totalAmount = 0;

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          ok: false,
          message: `Stock insuficiente para ${item.product.name}`,
        });
      }

      totalAmount += item.quantity * Number(item.product.price);
    }

    // 3️⃣ Crear orden (PENDING)
    const order = orderRepo.create({
      user: { id: userId },
      total_amount: totalAmount,
      status: "pending",
    });

    await orderRepo.save(order);

    // 4️⃣ Crear detalles de la orden (precio congelado)
    for (const item of cart.items) {
      const detail = orderDetailRepo.create({
        order: { id: order.id },
        product: { id: item.product.id },
        quantity: item.quantity,
        price: item.product.price,
      });

      await orderDetailRepo.save(detail);
    }

    // 5️⃣ Vaciar carrito
    await cartItemRepo.delete({
      cart: { id: cart.id },
    });

    // 6️⃣ Respuesta
    return res.json({
      ok: true,
      message: "Orden creada correctamente",
      order_id: order.id,
      total_amount: totalAmount,
      status: order.status,
    });

  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al crear la orden",
    });
  }
};

export const orderController = {
  createOrder,
};
