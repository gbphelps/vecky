import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';

const SESSION_ALIVE_MINUTES = 30;

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
    rolling: true,
    cookie: {
      secure: app.get('env') === 'production',
      httpOnly: true,
      sameSite: true,
      maxAge: SESSION_ALIVE_MINUTES * 60 * 1000,
    },
  }));
}

export default initSessions;
