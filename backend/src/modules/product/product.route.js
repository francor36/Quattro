import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware.js"
import { createProductSchema } from "./schema/product.schema.js";
import { productController } from "./product.controller.js";

const productRoutes = Router();

productRoutes.post('/products', 
    validate(createProductSchema), 
    productController.create);

export default productRoutes;