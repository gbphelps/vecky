declare namespace Express {
    export interface Request {
        db: import('mongodb').Db
    }
}
