import joi from 'joi';

export const createUserSchema = joi.object({
  nombre: joi.string().max(100).required(),
  apellido: joi.string().max(100).required(),
  email: joi.string().email().max(255).required(),
  password: joi.string().required(),
  telefono: joi.string().allow(null, ''),
  direccion: joi.string().allow(null, ''),
  rol: joi.string().valid('cliente', 'admin').default('cliente'),
  created_at: joi.date().default(() => new Date()) // <-- solo la función
});
