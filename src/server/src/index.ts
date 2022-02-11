import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import apiRouter from './api';
import initMongoDb from './mongodb';
import initSessions from './sessions';
import initPostgres from './psql';

async function main() {
  const app = express();

  initPostgres(app);
  await initMongoDb(app);
  initSessions(app);

  // TODO: consider enabling in all envs; main drawback is
  // that you can't use postman if you do
  // Add CSRF protection in every environment but development
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
    res.set({
      'X-Frame-Options': 'DENY',
    });

    res.render('index', { isLoggedIn: Boolean(req.session.user), csrfToken: req.csrfToken?.() ?? 'no_csrf_in_dev' });
  });

  app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
}

main();
