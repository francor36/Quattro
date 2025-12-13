import Joi from "joi";

export const addCartItemSchema = Joi.object({
  productId: Joi.number().required().messages({
    "any.required": "El producto es obligatorio",
    "number.base": "El ID del producto debe ser un número"
  }),
  quantity: Joi.number().min(1).required().messages({
    "any.required": "La cantidad es obligatoria",
    "number.base": "La cantidad debe ser un número",
    "number.min": "La cantidad mínima es 1"
  })
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().min(1).required().messages({
    "any.required": "La cantidad es obligatoria",
    "number.base": "La cantidad debe ser un número",
    "number.min": "La cantidad mínima es 1"
  })
});

export const cartIdParamSchema = Joi.object({
  id: Joi.number().required().messages({
    "any.required": "El ID del item es obligatorio",
    "number.base": "El ID del item debe ser un número"
  })
});
