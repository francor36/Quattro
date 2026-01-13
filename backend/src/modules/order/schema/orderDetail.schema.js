import Joi from "joi";

export const orderDetailSchema = Joi.object({
  productId: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().positive().required()
});
