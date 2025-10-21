import { request, response } from "express";
import AppDataSource from "../../providers/datasource.provider.js";

const repository = AppDataSource.getRepository("Product");

const create = async (req = request, res = response) => {
  try {
    const product = req.body;

    // Si hay imagen subida, se agrega al producto
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const newProduct = await repository.save(product);

    res.status(201).json({
      ok: true,
      result: newProduct,
      msg: "Producto creado correctamente",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
      msg: "Error al crear el producto",
    });
  }
};

export const productController = { create };
