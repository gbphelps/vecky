import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';

declare module 'express-session' {
  interface SessionData {
    user: {[key: string]: any}
  }
}

function initSessions(app) {
  const RedisStore = connectRedis(session);

  const redisClient = createClient();

  redisClient.on('error', console.error);

  if (app.get('env') === 'production') app.set('trust proxy', 1);

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    cookie: {
      secure: app.get('env') === 'production',
      httpOnly: true,
      sameSite: true,
    },
  }));
}

export default initSessions;
