import { MongoClient } from 'mongodb';
import type { Express } from 'express';

async function initMongoDb(app: Express) {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const connection = client.db(process.env.MONGO_DATABASE);

  app.use((req, _, next) => {
    req.db = connection;
    next();
  });
}

export default initMongoDb;
