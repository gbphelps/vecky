import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { body: { username, password } } = req;

  const user = await req.db.collection('users').findOne({ username });

  if (!user) {
    res.status(403).send('invalid credentials');
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.status(403).send('invalid credentials');
    return;
  }

  res.status(200).send();
});

export default router;
