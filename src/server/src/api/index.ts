import express from 'express';
import usersRouter from './users';

const router = express.Router();

router.use('/users', usersRouter);

router.get('/', (_, res) => {
  res.send('API ROUTES HERE!');
});

export default router;
