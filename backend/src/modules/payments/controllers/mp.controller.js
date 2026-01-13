import { MercadoPagoConfig, Preference } from "mercadopago";
import AppDataSource from "../../../providers/datasource.provider.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);
const Order = AppDataSource.getRepository("Order");

export const createMpPreference = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ ok: false, message: "Orden no encontrada" });
    }

    // 🔒 NO permitir pagar dos veces
    if (order.status === "paid") {
      return res.status(400).json({
        ok: false,
        message: "La orden ya fue pagada",
      });
    }

    const response = await preference.create({
      body: {
        items: [
          {
            title: `Orden #${order.id}`,
            quantity: 1,
            unit_price: Number(order.total_amount),
          },
        ],

        external_reference: String(order.id),

        back_urls: {
          success: "https://tuproyecto.ngrok-free.dev/success",
          failure: "https://tuproyecto.ngrok-free.dev/failure",
          pending: "https://tuproyecto.ngrok-free.dev/pending"
        },

        auto_return: "approved",

        notification_url:
          "https://TU_NGROK.ngrok-free.app/api/payments/mp/webhook",
      },
    });

    order.mp_preference_id = response.id;
    await Order.save(order);

    res.json({
      ok: true,
      init_point: response.sandbox_init_point,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: error.message });
  }
};
