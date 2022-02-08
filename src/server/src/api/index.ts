import express from 'express';
import usersRouter from './users';
import authRouter from './auth';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
  console.log(req.session);
  res.send('API ROUTES HERE!');
});

export default router;
