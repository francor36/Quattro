import Joi from "joi";

export const createOrderSchema = Joi.object({
  payment_method: Joi.string()
    .valid("cash", "mp")
    .required()
});
