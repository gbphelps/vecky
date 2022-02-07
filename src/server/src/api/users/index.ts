import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { body: { username, password } } = req;

  const user = await req.db.collection('users').findOne({ username });

  if (user) {
    res.status(409).send('username already taken');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  req.db.collection('users').insertOne({ username, passwordHash });

  res.status(200).send();
});

export default router;
