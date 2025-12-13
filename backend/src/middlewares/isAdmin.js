const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            ok: false,
            message: "Unauthorized"
        });
    }

    // 👇 ACA ESTA LA CLAVE
    if (req.user.rol !== "admin") {
        return res.status(403).json({
            ok: false,
            message: "Acceso denegado: se requiere rol ADMIN"
        });
    }

    next();
};

export default isAdmin;
