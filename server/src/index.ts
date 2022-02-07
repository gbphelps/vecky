import express from 'express';

const app = express();
const port = 3000;

app.set('views', './server/src/views');
app.set('view engine', 'ejs');
app.use(express.static('./server/src/public'));

app.get('/', (_, res) => {
  res.render('index', { csrfToken: 'fake_csrf_token' });
});

app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
