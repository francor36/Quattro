import { MercadoPagoConfig, Preference } from "mercadopago";
import AppDataSource from "../../../providers/datasource.provider.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);
const Order = AppDataSource.getRepository("Order");

const ORDER_STATUSES = { PAID: 'paid' };

// 🔥 IMPORTANTE: usar SIEMPRE el mismo dominio
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // backend

export const createMpPreference = async (req, res) => {
  const orderId = req.body?.orderId ? Number(req.body.orderId) : null;

  console.log('Iniciando creación de preferencia para orderId:', orderId);

  try {
    // ✅ Validación
    if (!orderId || isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({
        ok: false,
        message: "orderId inválido"
      });
    }

    // ✅ Buscar orden
    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Orden no encontrada"
      });
    }

    console.log('Orden encontrada:', order);

    // ✅ Verificar estado
    if (order.status === ORDER_STATUSES.PAID) {
      return res.status(400).json({
        ok: false,
        message: "La orden ya fue pagada"
      });
    }

    if (order.mp_preference_id) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe preferencia"
      });
    }

    // ✅ Validar monto
    const amount = parseFloat(order.total_amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Monto inválido"
      });
    }

    console.log('Monto validado:', amount);

    // 🔥 DEBUG CLAVE
    console.log("BACK URLS:", {
      success: `${FRONTEND_URL}/success`,
      failure: `${FRONTEND_URL}/failure`,
      pending: `${FRONTEND_URL}/pending`,
    });

    // ✅ Crear preferencia
    let response;
    try {
      response = await preference.create({
        body: {
          items: [
            {
              title: `Orden #${order.id}`,
              quantity: 1,
              unit_price: amount,
            },
          ],
          external_reference: String(order.id),

          // 🔥 CORREGIDO
          back_urls: {
            success: `${FRONTEND_URL}/success`,
            failure: `${FRONTEND_URL}/failure`,
            pending: `${FRONTEND_URL}/pending`,
          },



          // webhook → backend (esto sí va en BASE_URL)
          notification_url: `${BASE_URL}/api/payments/mp/webhook`,
        },
        auto_return: "approved",
      });

      console.log('Preferencia creada:', response.id);

    } catch (mpError) {
      console.error(
        'ERROR REAL MP:',
        mpError.response?.data || mpError.message
      );

      return res.status(500).json({
        ok: false,
        message: "Error real de MercadoPago",
        error: mpError.response?.data || mpError.message
      });
    }

    // ✅ Guardar en DB
    order.mp_preference_id = response.id;
    await Order.save(order);

    // ✅ Respuesta
    return res.json({
      ok: true,
      init_point: response.init_point,
      preference_id: response.id,
    });

  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
};