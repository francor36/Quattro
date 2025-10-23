export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    // Aquí va tu lógica de token o sesión
    // ...

    // 🔔 Emite notificación
    const io = req.app.get('io');
    io.emit('usuario:inicio', {
      mensaje: `El usuario ${user.nombre} ha iniciado sesión.`,
      usuario: { id: user.id, email: user.email },
    });

    res.status(200).json({ msg: 'Inicio de sesión exitoso', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
};
