export const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          ok: false,
          message: "Acceso denegado: se requiere rol ADMIN",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
  };
};
