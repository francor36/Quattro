import express from 'express';
import { envs } from './configurations/envs.js';
import productRoutes from './modules/product/product.route.js';

const app = express();

app.use(express.json());

app.set('port', envs.PORT);

app.use(productRoutes);

export default app;