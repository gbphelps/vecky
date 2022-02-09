import connectKnex from 'knex';
import type { Express } from 'express';
import config from './knexfile';

function initPostgres(app: Express) {
  const envConfig = config[app.get('env')];
  if (!envConfig) throw new Error(`No config for NODE_ENV ${app.get('env')}!`);
  const connection = connectKnex(envConfig);

  app.use((req, _, next) => {
    req.psql = connection;
    next();
  });
}

export default initPostgres;
