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
  try {
    const type = req.query.type || req.body.type;

    // ignorar todo lo que no sea payment
    if (type !== "payment") return res.sendStatus(200);

    const paymentId = req.query["data.id"] || req.body?.data?.id;
    if (!paymentId) return res.sendStatus(200);

    // obtener pago real desde MP
    const mpResponse = await paymentMP.get({ id: paymentId });
    const payment = mpResponse;

    // solo pagos aprobados
    if (payment.status !== "approved") return res.sendStatus(200);

    const orderId = payment.external_reference;
    if (!orderId) return res.sendStatus(200);

    // buscar orden
    const order = await orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ["details", "details.product"],
    });
    if (!order) return res.sendStatus(200);

    // evitar reprocesar
    if (order.status === "paid") return res.sendStatus(200);

    // validar monto
    const paidAmount = Number(payment.transaction_amount);
    const orderAmount = Number(order.total_amount);
    if (paidAmount !== orderAmount) {
      console.error("❌ Monto inválido", { paidAmount, orderAmount });
      return res.sendStatus(200);
    }

    // guardar pago
    await createPayment({
      orderId: order.id,
      mpPaymentId: payment.id,
      paymentMethod: payment.payment_method_id,
      amount: paidAmount,
      status: payment.status,
    });

    // descontar stock
    for (const detail of order.details) {
      const product = detail.product;
      product.stock -= detail.quantity;
      await productRepo.save(product);
    }

    // marcar orden como pagada
    order.status = "paid";
    await orderRepo.save(order);

    return res.sendStatus(200);
  } catch (error) {
    console.error("❌ MP webhook error:", error);
    return res.sendStatus(200); // MP requiere SIEMPRE 200
  }
};
