import {request, response} from 'express';
import AppDataSource from '../../providers/datasource.provider.js';


const repository = AppDataSource.getRepository('Product');

const create = async (req=request, res=response) => {
    const product = req.body;

    try{
        const newProduct = await repository.save(product);

        res.status(201).json({ ok:true, result: newProduct, msg: 'Created'});
    } catch (error){
        res.status(400).json({ok: false, error, msg: 'Error'});
    }
};

export const productController = {
    create,
};