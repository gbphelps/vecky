import express from 'express';
import bodyParser from 'body-parser';
import apiRouter from './api';
import getDbConnection from './mongodb';

async function main() {
  const app = express();

  const mongoConnection = await getDbConnection();

  const port = 3000;

  // views - only used for shell template to inject csrf token
  app.set('views', './src/server/src/views');
  app.set('view engine', 'ejs');

  // static files
  app.use(express.static('./src/server/src/public'));

  // middleware
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    req.db = mongoConnection;
    next();
  });

  // routes
  app.use('/api', apiRouter);
  app.get('*', (_, res) => {
    // send app shell with csrf token
    res.render('index', { csrfToken: 'fake_csrf_token' });
  });

  app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
}

main();
