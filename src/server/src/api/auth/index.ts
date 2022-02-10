import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  if (req.session.user) {
    res.status(403).send('already logged in');
    return;
  }

  const { body: { username, password } } = req;

  const user = (await req.psql
    .select('username', 'password')
    .from('users')
    .where('username', username))[0];

  if (!user) {
    res.status(403).send('invalid credentials');
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.status(403).send('invalid credentials');
    return;
  }

  req.session.user = {
    username: user.username,
    id: user.id,
  };

  res.status(200).send();
});

router.post('/logout', (req, res) => {
  if (!req.session.user) {
    res.send();
    return;
  }

  const onDestroy = (err?: Error) => {
    if (err) {
      res.status(422).send('Could not process logout request');
      return;
    }
    res.status(200).send();
  };

  req.session.destroy(onDestroy);
});

export default router;
