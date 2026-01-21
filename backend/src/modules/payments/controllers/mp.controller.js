import { MercadoPagoConfig, Preference } from "mercadopago";
import AppDataSource from "../../../providers/datasource.provider.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);
const Order = AppDataSource.getRepository("Order");

// Constantes para mantenibilidad
const ORDER_STATUSES = { PAID: 'paid' };
const BASE_URL = process.env.BASE_URL || 'https://tuproyecto.ngrok-free.dev'; // Cambia a dominio real en prod

/**
 * Crea una preferencia de pago en MercadoPago para una orden.
 * Verifica que la orden exista, no esté pagada, no tenga preferencia previa y tenga un monto válido.
 * Incluye logging detallado para diagnosticar errores en el pago.
 */
export const createMpPreference = async (req, res) => {
  console.log('Iniciando creación de preferencia para orderId:', req.body?.orderId); // Log inicial

  try {
    // Validación de entrada
    if (!req.body || !req.body.orderId || typeof req.body.orderId !== 'number' || req.body.orderId <= 0) {
      console.error('Validación fallida: orderId inválido');
      return res.status(400).json({ ok: false, message: "orderId es requerido y debe ser un número positivo" });
    }

    const { orderId } = req.body;

    console.log('Buscando orden en DB...');
    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      console.error('Orden no encontrada:', orderId);
      return res.status(404).json({ ok: false, message: "Orden no encontrada" });
    }

    console.log('Orden encontrada:', { id: order.id, status: order.status, total_amount: order.total_amount });

    // Verificar si ya está pagada
    if (order.status === ORDER_STATUSES.PAID) {
      console.warn('Orden ya pagada, rechazando:', orderId);
      return res.status(400).json({
        ok: false,
        message: "La orden ya fue pagada",
      });
    }

    // Verificar idempotencia: si ya tiene preferencia
    if (order.mp_preference_id) {
      console.warn('Ya existe preferencia para orden:', orderId, 'ID:', order.mp_preference_id);
      return res.status(400).json({
        ok: false,
        message: "Ya existe una preferencia para esta orden",
      });
    }

    // Validar y convertir monto de la orden a número
    const amount = parseFloat(order.total_amount);
    if (isNaN(amount) || !isFinite(amount) || amount <= 0) {
      console.error('Monto inválido en orden:', order.total_amount, 'Convertido a:', amount);
      return res.status(400).json({ ok: false, message: "El monto de la orden debe ser un número positivo válido" });
    }

    console.log('Monto validado:', amount);

    // Crear preferencia en MercadoPago
    console.log('Creando preferencia en MercadoPago...');
    let response;
    try {
      response = await preference.create({
        body: {
          items: [
            {
              title: `Orden #${order.id}`,
              quantity: 1,
              unit_price: amount, // Ahora es un número válido
            },
          ],
          external_reference: String(order.id),
          back_urls: {
            success: `${BASE_URL}/success`,
            failure: `${BASE_URL}/failure`,
            pending: `${BASE_URL}/pending`,
          },
          auto_return: "approved",
          notification_url: `${BASE_URL}/api/payments/mp/webhook`,
        },
      });
      console.log('Preferencia creada exitosamente en MP:', { id: response.id, init_point: response.init_point });
    } catch (mpError) {
      console.error('Error creando preferencia en MercadoPago:', mpError.message, 'Detalles:', mpError.response?.data || mpError);
      return res.status(500).json({ ok: false, message: "Error al crear preferencia en MercadoPago. Revisa el token y URLs." });
    }

    // Actualizar orden en DB
    console.log('Actualizando orden en DB con preference_id...');
    try {
      order.mp_preference_id = response.id;
      await Order.save(order);
      console.log('Orden actualizada exitosamente:', orderId);
    } catch (dbError) {
      console.error('Error guardando orden en DB:', dbError.message);
      return res.status(500).json({ ok: false, message: "Preferencia creada en MP, pero error al guardar en DB. Contacta soporte." });
    }

    // Respuesta exitosa
    console.log('Respuesta enviada al cliente:', { ok: true, preference_id: response.id });
    res.json({
      ok: true,
      init_point: response.init_point, // Ahora siempre usa init_point (producción)
      preference_id: response.id, // Para referencia
    });

  } catch (error) {
    console.error('Error general en createMpPreference:', error.message, 'Stack:', error.stack);
    res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
};