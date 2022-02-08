import { MongoClient } from 'mongodb';

const CONNECTION_URL = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = 'myProject';

async function initMongoDb(app) {
  const client = new MongoClient(CONNECTION_URL);
  await client.connect();
  const connection = client.db(DATABASE_NAME);

  app.use((req, res, next) => {
    req.db = connection;
    next();
  });
}

export default initMongoDb;
