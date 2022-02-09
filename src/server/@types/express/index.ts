// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace Express {
    export interface Request {
        db: import('mongodb').Db;
        psql: import('knex').Knex;
    }
  }
