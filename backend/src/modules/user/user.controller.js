import { request, response } from 'express';
import AppDataSource from '../../providers/datasource.provider.js';
import { envs } from '../../configurations/envs.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUserSchema } from './schema/user.schema.js';
// Tu schema Joi

const repository = AppDataSource.getRepository('User');

// ===================== REGISTRO =====================
const register = async (req = request, res = response) => {
  try {
    // Validar body con Joi
    await createUserSchema.validateAsync(req.body, { abortEarly: false });

    const { password, ...user } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await repository.save({ ...user, password: hashPassword });

    res.status(201).json({
      ok: true,
      user: { ...newUser, password: '***' },
      message: 'User created',
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message, message: "User can't be created" });
  }
};

// ===================== LOGIN =====================
const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });
    if (!user) return res.status(400).json({ ok: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ ok: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, envs.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      ok: true,
      token,
      user: { ...user, password: '***' },
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// ===================== BUSCAR USUARIO =====================
const getUserById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await repository.findOne({ where: { id } });
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

    res.json({ ok: true, user: { ...user, password: '***' } });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// ===================== BORRAR USUARIO =====================
const deleteUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await repository.findOne({ where: { id } });
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

    await repository.remove(user);
    res.json({ ok: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const userController = {
  register,
  login,
  getUserById,
  deleteUser,
};
