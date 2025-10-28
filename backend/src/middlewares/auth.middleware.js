import  passport  from '../configurations/passport.js';

function authMiddleware(req, res, next) {
    //OBTENCION DEL TOKEN DESDE EL REQ EL CUAL VA A USAR PASAPORTE
    return passport.authenticate('jwt', { session: false }, (err, user) => {
        //Lo que estamos diciendo aca es que si el usuario no existe o hay un error es falso
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.user = user; //GUARDAMOS EL USUARION EN EL REQ
        next();
    })(req, res, next);
}

export default authMiddleware;