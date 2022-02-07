import { MongoClient } from 'mongodb';

const CONNECTION_URL = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = 'myProject';

async function getDbConnection() {
  const client = new MongoClient(CONNECTION_URL);
  await client.connect();
  return client.db(DATABASE_NAME);
}

export default getDbConnection;
