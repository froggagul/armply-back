import express from 'express';
import AuthRouter from './auth';

const router = express.Router();

router.use('/auth', AuthRouter);

router.get('/', (_req, res) => {
    res.send('hello this is db');
});

export default router;
