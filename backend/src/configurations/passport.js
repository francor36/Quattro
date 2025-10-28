import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { envs } from "./envs.js";
import AppDataSource from '../providers/datasource.provider.js';

const JWT_SECRET = envs.JWT_SECRET;
//EXTRACCION DE TOKEN HEADER AUTOMATICO

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET,
};

passport.use(
    new Strategy(opts, async (payload, done) => {
        try {
            const repo = AppDataSource.getRepository('User');
            //Otencion de datos mediante req en este req.user
            //la forma de obtencion es mediante una consulta a la base de datos
            const user = await repo.findOne({ where: { id: payload.id } })
            if (!user) {
                //SI EL USUARIO NO EXISTE EL PASAPORTE ES INVALIDO
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }

    })
);
export default passport;

