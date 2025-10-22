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









const findAll = async (req = request, res = response) => {
    try {
        const products = await repository.find();
        res.status(200).json({ ok: true, result: products, msg: 'Products retrieved successfully' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message, msg: 'Error retrieving products' });
    }
};


const findOne = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const product = await repository.findBy({id: id});
        if (!product) {
            return res.status(404).json({ ok: false, msg: 'Product not found' });
        }
        res.status(200).json({ ok: true, result: product, msg: 'Product retrieved successfully' });
    } catch (error) {
        res.status(500).json({ ok: false, error, msg: 'Error retrieving product' });
    }
};


const update = async (req = request, res = response) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await repository.update(id, updates);
        if (!updatedProduct) {
            return res.status(404).json({ ok: false, msg: 'Product not found' });
        }
        res.status(200).json({ ok: true, result: updatedProduct, msg: 'Product updated successfully' });
    } catch (error) {
        res.status(400).json({ ok: false, error, msg: 'Error updating product' });
    }
};


const remove = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const deletedProduct = await repository.delete(id);
        if (!deletedProduct) {
            return res.status(404).json({ ok: false, msg: 'Product not found' });
        }
        res.status(200).json({ ok: true, result: deletedProduct, msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ ok: false, error, msg: 'Error deleting product' });
    }
};

export const productController = {
    create,
    findAll,
    findOne,
    update,
    remove
};