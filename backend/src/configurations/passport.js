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

            // 👇 convertir id a número si tu DB usa bigint
            const userId = Number(payload.id);

            const user = await repo.findOne({ where: { id: userId } });

            // Log para verificar
            console.log(">>> Usuario encontrado en passport:", user);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    })
);
export default passport;

