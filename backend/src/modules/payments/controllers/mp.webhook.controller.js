import { MercadoPagoConfig, Payment } from "mercadopago";
import AppDataSource from "../../../providers/datasource.provider.js";
import { createPayment } from "../payment.controller.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const paymentMP = new Payment(client);

const orderRepo = AppDataSource.getRepository("Order");
const productRepo = AppDataSource.getRepository("Product");

export const mercadopagoWebhook = async (req, res) => {
  console.log('🔔 Webhook recibido de MP');
  console.log('Query:', req.query);
  console.log('Body:', req.body);

  try {
    const type = req.query.type || req.query.topic || req.body.type || req.body.topic;
    console.log('📌 Type:', type);

    // ignorar todo lo que no sea payment
    if (type !== "payment") {
      console.log('⏭️ Ignorando (no es payment)');
      return res.sendStatus(200);
    }

    const paymentId = req.query["data.id"] || req.query.id || req.body?.data?.id;
    console.log('💳 Payment ID:', paymentId);
    
    if (!paymentId) {
      console.log('❌ No paymentId');
      return res.sendStatus(200);
    }

    // obtener pago real desde MP
    console.log('🔍 Obteniendo pago de MP...');
    const mpResponse = await paymentMP.get({ id: paymentId });
    const payment = mpResponse;
    console.log('✅ Pago obtenido:', {
      id: payment.id,
      status: payment.status,
      amount: payment.transaction_amount,
      external_reference: payment.external_reference
    });

    // solo pagos aprobados
    if (payment.status !== "approved") {
      console.log(`⏸️ Pago no aprobado (status: ${payment.status})`);
      return res.sendStatus(200);
    }

    const orderId = payment.external_reference;
    if (!orderId) {
      console.log('❌ Sin external_reference');
      return res.sendStatus(200);
    }

    console.log('🔍 Buscando orden:', orderId);
    // buscar orden
    const order = await orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ["details", "details.product"],
    });
    
    if (!order) {
      console.log('❌ Orden no encontrada:', orderId);
      return res.sendStatus(200);
    }

    console.log('📦 Orden encontrada:', {
      id: order.id,
      status: order.status,
      amount: order.total_amount
    });

    // evitar reprocesar
    if (order.status === "paid") {
      console.log('⚠️ Orden ya pagada, ignorando');
      return res.sendStatus(200);
    }

    // validar monto
    const paidAmount = Number(payment.transaction_amount);
    const orderAmount = Number(order.total_amount);
    console.log('💰 Validando montos:', { paidAmount, orderAmount });
    
    if (paidAmount !== orderAmount) {
      console.error("❌ Monto inválido", { paidAmount, orderAmount });
      return res.sendStatus(200);
    }

    console.log('💾 Guardando pago...');
    // guardar pago en tabla Payment
    await createPayment({
      orderId: order.id,
      mpPaymentId: String(payment.id),
      paymentMethod: payment.payment_method_id,
      amount: paidAmount,
      status: payment.status,
    });

    console.log('📦 Descontando stock...');
    // descontar stock
    for (const detail of order.details) {
      const product = detail.product;
      console.log(`  - Producto ${product.id}: ${product.stock} → ${product.stock - detail.quantity}`);
      product.stock -= detail.quantity;
      await productRepo.save(product);
    }

    console.log('✅ Actualizando orden: status, mp_payment_id, mp_status');
    // marcar orden como pagada Y guardar datos del pago de MP
    order.status = "paid";
    order.mp_payment_id = String(payment.id);  // ✅ AGREGAR ESTO
    order.mp_status = payment.status;           // ✅ AGREGAR ESTO
    await orderRepo.save(order);

    console.log('🎉 Webhook procesado exitosamente');
    return res.sendStatus(200);
  } catch (error) {
    console.error("❌ MP webhook error:", error);
    console.error("Stack:", error.stack);
    return res.sendStatus(200); // MP requiere SIEMPRE 200
  }
};