import {request, response} from 'express';
import AppDataSource from '../../providers/datasource.provider.js';


const repository = AppDataSource.getRepository('User');

const create = async (req=request, res=response) => {
    const user = req.body;

    try{
        const newUser = await repository.save(user);

        res.status(201).json({ ok:true, result: newUser, msg: 'Created'});
    } catch (error){
        res.status(400).json({ok: false, error, msg: 'Error'});
    }
};

export const userController = {
    create,
};