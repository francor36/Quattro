import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { envs } from './configurations/envs.js';
import productRoutes from './modules/product/product.route.js';

const app = express();

app.use(cors());

app.use(express.json());

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
app.use('/uploads', express.static(path.join(dirname, 'uploads')));


app.set('port', envs.PORT);

app.use(productRoutes);

export default app;