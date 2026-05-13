import { request, response } from 'express';
import AppDataSource from '../../providers/datasource.provider.js';
import { envs } from '../../configurations/envs.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUserSchema } from './schema/user.schema.js';

const repository = AppDataSource.getRepository('User');
const failedAttempts = {}; // se guardan los intententos 
const blockedIps = {}; //se guardan las ips bloqueadas

// ===================== REGISTRO =====================
const register = async (req = request, res = response) => {
  try {
    await createUserSchema.validateAsync(req.body, { abortEarly: false });

    const { password, role = "CLIENT", ...user } = req.body;

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await repository.save({
      ...user,
      password: hashPassword,
      role,
    });

    const io = req.app.get('io');
    io.emit('register', { message: '¡Se registro un nuevo usuario!', user: newUser.nombre + " " + newUser.apellido });

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
  const ip = req.ip;
  if (blockedIps[ip]) { //primero vemos si la ip esta bloqueda

    const now = Date.now(); //obtenemos la marca del tiempo

    if (now < blockedIps[ip]) { //Si now < blockedIps[ip] significa que el bloqueo aún está activo

      return res.status(403).json({ // Devuelve error 403 Forbidden indicando que la IP está bloqueada
        ok: false,
        message: 'IP bloqueada',
        retryAfterSeconds:
          Math.floor((blockedIps[ip] - now) / 1000),
      });
    }
    // Si llegamos aquí, significa que el bloqueo ya expiró
    // Se podría agregar: delete blockedIps[ip]; para limpiar el objeto
    delete blockedIps[ip];
  }
  try {
    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });
    if (!user) return res.status(400).json({ ok: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {

      failedAttempts[ip] =
        (failedAttempts[ip] || 0) + 1;

      console.log({
        ip,
        attempts: failedAttempts[ip],
        endpoint: '/users/login'
      });

      if (failedAttempts[ip] >= 3) {

        blockedIps[ip] =
          Date.now() + 60 * 1000;

        failedAttempts[ip] = 0;

        return res.status(403).json({
          ok: false,
          message: 'IP bloqueada',
          retryAfterSeconds: 60,
        });
      }

      return res.status(400).json({
        ok: false,
        message: 'Invalid credentials'
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      envs.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      ok: true,
      token,
      user: { ...user, password: '***' },
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

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
