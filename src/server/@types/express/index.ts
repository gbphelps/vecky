interface SessionData {
    user: { [key: string]: any }
}

declare namespace Express {
    export interface Request {
        db: import('mongodb').Db;
        psql: import('knex').Knex;
        session: import('express-session').Session & Partial<SessionData>
    }
  }
