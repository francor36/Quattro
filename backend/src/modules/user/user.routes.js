import { Router } from 'express';
import { validateBody } from '../../middlewares/validator.middleware.js';
import { createUserSchema } from './schema/user.schema.js';
import { userController } from './user.controller.js';

const userRoutes = Router();

// Registro de usuario
userRoutes.post('/register', validateBody(createUserSchema), userController.register);

// Login
userRoutes.post('/login', userController.login);

// Obtener usuario por ID
userRoutes.get('/:id', userController.getUserById);

// Borrar usuario por ID
userRoutes.delete('/:id', userController.deleteUser);

export default userRoutes;
