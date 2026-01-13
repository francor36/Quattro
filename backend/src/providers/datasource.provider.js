import { DataSource } from "typeorm";
import { envs } from "../configurations/envs.js";
import { productEntity } from "../modules/product/entity/product.entity.js";
import { userEntity } from "../modules/user/entity/user.entity.js";
import { cartEntity } from "../modules/cart/entity/ShoppingCart.entity.js";
import { cartItemEntity } from "../modules/cart/entity/cart_item.entity.js";
import { orderEntity } from "../modules/order/entity/order.entity.js";
import { orderDetailEntity } from "../modules/order/entity/orderDetail.entity.js";
import { PaymentSchema } from "../modules/payments/entity/payment.entity.js";
const AppDataSource = new DataSource({
    type: 'mysql', //# Tipo de bd que se va a usar
    //#apartir de aca van las credenciales
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USER,
    password: envs.DB_PASS,
    database: envs.DATABASE,
    //# hasta aca las credenciales

    synchronize: true, //# sincroniza automaticamente las entidades con la DB
    logging: false, //# si quieren ver los logs se habilita esta propiedad
    entities: [productEntity, userEntity, cartEntity, cartItemEntity, orderEntity,
        orderDetailEntity,PaymentSchema], //aca se agregan las entidades
});

export default AppDataSource