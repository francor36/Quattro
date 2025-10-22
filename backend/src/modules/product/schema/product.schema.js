import joi from 'joi';

export const createProductSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().allow('').optional(),
    price: joi.number().required(),
    category: joi.string().required(),
    stock: joi.number().required(),
    image: joi.string().optional(),
});

export const updateProductSchema = joi.object({
    name: joi.string(),
    description: joi.string().optional(),
    price: joi.number(),
    category: joi.string(),
    stock: joi.number()
})

export const idParamSchema = joi.object({
  id: joi.string().required()
});
