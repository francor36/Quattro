import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { envs } from './configurations/envs.js';
import productRoutes from './modules/product/product.route.js';
import userRoutes from './modules/user/user.routes.js'; // <-- importamos
import passport from './configurations/passport.js';
import cartRoutes from './modules/cart/cart.route.js';
import orderRoutes from "./modules/order/orders.routes.js";
import mpRoutes from "./modules/payments/routes/mp.routes.js";
import rateLimit from 'express-rate-limit';
const app = express();
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        message: 'Demasiadas requests'
    }
});

app.use(cors());
app.use(express.json());
app.use(globalLimiter);

app.use((req, res, next) => {
    req.io = req.app.get('io')
    next();
});

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

app.set('port', envs.PORT);


app.use(passport.initialize());

// Montamos rutas

app.use(productRoutes);
app.use('/users', userRoutes); // <-- montamos rutas de usuario
//cart
app.use('/cart', cartRoutes); // prefijo
app.use("/orders", orderRoutes);
app.use("/api/payments", mpRoutes);


export default app;
