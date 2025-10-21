import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware.js"
import { createUserSchema } from "./schema/user.schema.js";
import { userController } from "./user.controller.js";

const productRoutes = Router();

productRoutes.post('/user', 
    validate(createUserSchema), 
    userController.create);

export default userRoutes;