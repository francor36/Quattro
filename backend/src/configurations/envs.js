import joi from 'joi';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Definir esquema de validación de variables de entorno
const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_PASS: joi.string().allow('').optional(),
    DB_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required()

}).unknown(true);

// Validar variables de entorno
const {value, error} = envsSchema.validate(process.env);

if (error) throw new Error(error.message);

// Exportar variables de entorno ya validadas
export const envs = {
    PORT: value.PORT,
    DATABASE: value.DATABASE,
    DB_USER: value.DB_USER,
    DB_PORT: value.DB_PORT,
    DB_PASS: value.DB_PASS,
    DB_HOST: value.DB_HOST,
    JWT_SECRET: value.JWT_SECRET,
};
