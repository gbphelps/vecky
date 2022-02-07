import express from 'express';
import usersRouter from './users';
import authRouter from './auth';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (_, res) => {
  res.send('API ROUTES HERE!');
});

export default router;
