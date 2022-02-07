import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body.username);
  res.send();
});

export default router;
