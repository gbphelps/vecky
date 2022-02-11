import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  if (req.session.user) {
    res.status(403).json({ error: 'already logged in' });
    return;
  }

  const { body: { username, password } } = req;

  const user = (await req.psql
    .select('username', 'id', 'password')
    .from('users')
    .where('username', username))[0];

  if (!user) {
    res.status(403).json({ error: 'invalid credentials' });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.status(403).json({ error: 'invalid credentials' });
    return;
  }

  const loggedInUser = {
    username: user.username,
    id: user.id,
  };

  req.session.user = loggedInUser;

  res.status(200).json(loggedInUser);
});

router.get('/user', async (req, res) => {
  if (!req.session.user) {
    res.status(403).json({ error: 'No session found.' });
    return;
  }

  res.status(200).json(req.session.user);
});

router.post('/logout', (req, res) => {
  if (!req.session.user) {
    res.status(404).json({ error: 'No session found.' });
    return;
  }

  const onDestroy = (err?: Error) => {
    if (err) {
      res.status(422).json({ error: 'Could not process logout request' });
      return;
    }
    res.status(200).json({});
  };

  req.session.destroy(onDestroy);
});

export default router;
