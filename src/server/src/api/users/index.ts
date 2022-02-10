import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { body: { username, password } } = req;

  if (!password || !username) {
    res.status(422).send('invalid parameters');
    return;
  }

  const user = (await req.psql
    .select('username')
    .from('users')
    .where('username', username))[0];

  if (user) {
    res.status(403).send('username already taken');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await req.psql('users').insert({ username, password: passwordHash });

  res.status(200).send();
});

export default router;
