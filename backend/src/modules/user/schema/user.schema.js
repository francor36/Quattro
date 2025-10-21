import joi from 'joi';

export const createProductSchema = joi.object({
    id: joi.string().required(),
    nombre: joi.string().max(100).required(),
    apellido: joi.string().max(100).required(),
    email: joi.number().max(255).required(),
    password: joi.number().required(),
    telefono: joi.number().allow(null,""),
    direccion: joi.number().allow(null,""),
    rol: Joi.string().valid('cliente', 'admin').default('cliente'),
    created_at: Joi.date().default(() => new Date(), 'timestamp actual')
});