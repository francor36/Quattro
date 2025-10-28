import joi from 'joi';

export const loginUser = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});