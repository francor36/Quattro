import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { envs } from './configurations/envs.js';
import productRoutes from './modules/product/product.route.js';
import userRoutes from './modules/user/user.routes.js'; // <-- importamos
import passport from './configurations/passport.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.io = req.app.get('io')
    next();
});

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

app.set('port', envs.PORT);

// Montamos rutas
app.use(productRoutes);
app.use('/users', userRoutes); // <-- montamos rutas de usuario

app.use(passport.initialize());

export default app;
