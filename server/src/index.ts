import 'dotenv/config';
import express from 'express';
import path from 'path';

console.log(process.env.TEST);

const app = express();
const port = 3000;

app.set('views', './server/src/views');
app.set('view engine', 'ejs');
app.use(express.static('./server/src/public'));

app.get('/', (_, res) => {
  res.render('index', { csrfToken: 'fake_csrf_token', bundle: path.join(process.cwd(), 'frontend', 'build', 'bundle.js') });
});

app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
