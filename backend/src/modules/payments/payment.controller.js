import AppDataSource from "../../providers/datasource.provider.js";

const paymentRepository = AppDataSource.getRepository("Payment");

// Constantes para validación (puedes moverlas a un archivo separado si crecen)
const VALID_PAYMENT_STATUSES = ['pending', 'approved', 'rejected', 'cancelled']; // Ajusta según tu enum en la DB

/**
 * Crea un pago en la DB de forma idempotente.
 * Si el pago ya existe (basado en mpPaymentId), devuelve el existente.
 * Recibe: orderId (string, requerido), mpPaymentId (string, requerido), paymentMethod (string, requerido), amount (number positivo), status (string válido).
 * Retorna: El objeto Payment creado o existente.
 * Lanza error si hay validaciones fallidas o problemas en la DB.
 */
export const createPayment = async ({
  orderId,
  mpPaymentId,
  paymentMethod,
  amount,
  status,
}) => {
  // Validaciones de entrada
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('orderId es requerido y debe ser un string');
  }
  if (!mpPaymentId || typeof mpPaymentId !== 'string') {
    throw new Error('mpPaymentId es requerido y debe ser un string');
  }
  if (!paymentMethod || typeof paymentMethod !== 'string') {
    throw new Error('paymentMethod es requerido y debe ser un string');
  }
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('amount debe ser un número positivo');
  }
  if (!status || !VALID_PAYMENT_STATUSES.includes(status)) {
    throw new Error(`status debe ser uno de: ${VALID_PAYMENT_STATUSES.join(', ')}`);
  }

  try {
    // Usar upsert para idempotencia robusta (evita race conditions si la DB tiene constraint único en mp_payment_id)
    const paymentData = {
      order_id: orderId,
      mp_payment_id: mpPaymentId,
      payment_method_id: paymentMethod,
      amount,
      status,
    };

    // Upsert: inserta si no existe, actualiza si existe (basado en mp_payment_id)
    const result = await paymentRepository.upsert(paymentData, ['mp_payment_id']);
    
    // Retorna el pago (upsert devuelve un array, toma el primero)
    return result.generatedMaps ? result.generatedMaps[0] : await paymentRepository.findOneBy({ mp_payment_id: mpPaymentId });
  } catch (error) {
    console.error('Error creando pago:', error.message);
    // No expongas detalles internos en producción; lanza un error genérico
    throw new Error('No se pudo crear el pago. Verifica los datos e intenta nuevamente.');
  }
};