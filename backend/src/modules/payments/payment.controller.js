import AppDataSource from "../../providers/datasource.provider.js";

const paymentRepository = AppDataSource.getRepository("Payment");

/**
 * Crea un pago en la DB.
 * Idempotente: si el pago ya existe, devuelve el existente.
 */
export const createPayment = async ({
  orderId,
  mpPaymentId,
  paymentMethod,
  amount,
  status,
}) => {
  const exists = await paymentRepository.findOneBy({
    mp_payment_id: mpPaymentId,
  });

  if (exists) return exists; // ya registrado 🔐

  const payment = paymentRepository.create({
    order_id: orderId,
    mp_payment_id: mpPaymentId,
    payment_method_id: paymentMethod,
    amount,
    status,
  });

  return await paymentRepository.save(payment);
};
