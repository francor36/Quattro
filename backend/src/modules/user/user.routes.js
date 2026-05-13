import { Router } from 'express';
import { validateBody } from '../../middlewares/validator.middleware.js';
import { createUserSchema } from './schema/user.schema.js';
import { userController } from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const userRoutes = Router();

const loginLimiter = rateLimit({ //creamos una constante la cual va a proteger el endpoint login
    windowMs: 60 * 1000, //Ventana de tiempo en milisegundos
    max: 5, // Máximo de intentos permitidos
    message: {
        ok: false,
        message: 'Demasiados intentos de login'
    }
});


// Registro de usuario
userRoutes.post('/register', validateBody(createUserSchema), userController.register);

// Login
userRoutes.post(
    '/login',
    loginLimiter, //uso de cuando se hace el post
    userController.login
);

// Obtener usuario por ID
userRoutes.get('/:id', authMiddleware, userController.getUserById);

// Borrar usuario por ID
userRoutes.delete('/:id', authMiddleware, userController.deleteUser);

export default userRoutes;
