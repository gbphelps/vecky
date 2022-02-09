import type { Knex } from 'knex';

const {
  PSQL_HOST,
  PSQL_PORT,
  PSQL_USER,
  PSQL_PASSWORD,
  PSQL_DATABASE,
} = process.env as {[key: string]: any};

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: PSQL_HOST,
      port: +PSQL_PORT,
      user: PSQL_USER,
      password: PSQL_PASSWORD,
      database: PSQL_DATABASE,
    },
  },
};

export default config;
