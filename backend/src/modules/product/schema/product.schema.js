import joi from 'joi';

export const createProductSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().allow('').optional(),
    price: joi.number().required(),
    category: joi.string().required(),
    stock: joi.number().required(),
});