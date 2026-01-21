import AppDataSource from "../../providers/datasource.provider.js";

const paymentRepository = AppDataSource.getRepository("Payment");

// Constantes para validación
const VALID_PAYMENT_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'];

/**
 * Crea un pago en la DB de forma idempotente.
 * Si el pago ya existe (basado en mpPaymentId), devuelve el existente.
 * Recibe: orderId (number, requerido), mpPaymentId (string, requerido), paymentMethod (string, requerido), amount (number positivo), status (string válido).
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
  // Validaciones de entrada - AJUSTADO: orderId ahora acepta number también
  if (!orderId || (typeof orderId !== 'string' && typeof orderId !== 'number')) {
    throw new Error('orderId es requerido y debe ser un string o number');
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
    // Verificar si el pago ya existe (idempotencia)
    const existingPayment = await paymentRepository.findOne({
      where: { mp_payment_id: mpPaymentId }
    });

    if (existingPayment) {
      console.log('⚠️ Pago ya registrado, devolviendo existente:', mpPaymentId);
      return existingPayment;
    }

    // Crear nuevo pago
    const paymentData = {
      order_id: String(orderId), // Asegurar que sea string
      mp_payment_id: mpPaymentId,
      payment_method_id: paymentMethod,
      amount,
      status,
      payment_date: new Date(), // Agregar fecha de pago
    };

    console.log('💾 Insertando nuevo pago:', paymentData);

    // Crear e insertar el nuevo pago
    const payment = paymentRepository.create(paymentData);
    const savedPayment = await paymentRepository.save(payment);
    
    console.log('✅ Pago guardado exitosamente:', savedPayment.id);
    return savedPayment;

  } catch (error) {
    console.error('Error creando pago:', error.message);
    console.error('Stack completo:', error.stack);
    // Lanzar error con más contexto
    throw new Error(`No se pudo crear el pago: ${error.message}`);
  }
};