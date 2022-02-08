import express from 'express';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import apiRouter from './api';
import initMongoDb from './mongodb';
import initSessions from './sessions';

import 'dotenv/config';

async function main() {
  const app = express();

  await initMongoDb(app);
  initSessions(app);

  if (app.get('env') !== 'development') app.use(csrf());

  const port = 3000;

  // views - only used for shell template to inject csrf token
  app.set('views', './src/server/src/views');
  app.set('view engine', 'ejs');

  // static files
  app.use(express.static('./src/server/src/public'));

  // middleware
  app.use(bodyParser.json());

  // routes
  app.use('/api', apiRouter);

  app.get('*', (req, res) => {
    res.render('index', { csrfToken: req.csrfToken() });
  });

  app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
}

main();
