import { request, response } from "express";
import AppDataSource from "../../providers/datasource.provider.js";

const repository = AppDataSource.getRepository("Product");

// ✅ CREATE
const create = async (req = request, res = response) => {
  try {
    const product = req.body;

    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    // 🔥 múltiples imágenes
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newProduct = await repository.save(product);

    const io = req.app.get('io');
    io.emit('producto_creado', {
      message: '¡Se creó un producto nuevo!',
      product: newProduct
    });

    res.status(201).json({
      ok: true,
      result: newProduct,
      msg: "Producto creado correctamente"
    });

  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
      msg: "Error al crear el producto"
    });
  }
};

// ✅ FIND ALL
const findAll = async (req = request, res = response) => {
  try {
    const products = await repository.find();

    res.status(200).json({
      ok: true,
      result: products,
      msg: 'Productos obtenidos correctamente'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      msg: 'Error al obtener productos'
    });
  }
};

// ✅ FIND ONE (corregido)
const findOne = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const product = await repository.findOneBy({ id: Number(id) });

    if (!product) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      ok: true,
      result: product,
      msg: 'Producto obtenido correctamente'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      msg: 'Error al obtener producto'
    });
  }
};

// ✅ UPDATE (MULTI IMÁGENES)
const update = async (req = request, res = response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // 🔥 múltiples imágenes nuevas
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    await repository.update(id, updates);

    const updatedProduct = await repository.findOneBy({ id: Number(id) });

    res.status(200).json({
      ok: true,
      result: updatedProduct,
      msg: 'Producto actualizado correctamente'
    });

  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
      msg: 'Error al actualizar producto'
    });
  }
};

// ✅ DELETE
const remove = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const product = await repository.findOneBy({ id: Number(id) });

    if (!product) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    await repository.delete(id);

    res.status(200).json({
      ok: true,
      msg: 'Producto eliminado correctamente'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      msg: 'Error al eliminar producto'
    });
  }
};

export const productController = {
  create,
  findAll,
  findOne,
  update,
  remove
};