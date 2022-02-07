import 'dotenv/config';
import express from 'express';

const app = express();
const port = 3000;

app.set('views', process.env.PATH_TO_VIEWS);
app.set('view engine', 'ejs');
app.use(express.static(process.env.PATH_TO_STATIC_FILES));

app.get('/', (_, res) => {
  res.render('index', { csrfToken: 'fake_csrf_token' });
});

app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
