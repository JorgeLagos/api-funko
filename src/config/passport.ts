import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { env } from './env';
import { User } from '../models/user.model';
import { logger } from './logger';

passport.use(
  new GoogleStrategy(
    {
      clientID:     env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${env.BACKEND_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value ?? '';
        const avatar = profile.photos?.[0]?.value ?? '';

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Si el email coincide con ADMIN_EMAIL, asignar rol admin
          const role = env.ADMIN_EMAIL && email === env.ADMIN_EMAIL ? 'admin' : 'user';

          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            avatar,
            role,
          });

          logger.info(`✅ Nuevo usuario registrado: ${email} [${role}]`);
        } else {
          // Actualizar avatar y nombre por si cambiaron en Google
          user.avatar = avatar;
          user.name   = profile.displayName;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        logger.error('❌ Error en estrategia Google OAuth:', err);
        return done(err as Error);
      }
    }
  )
);

export default passport;
