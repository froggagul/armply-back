import express from 'express';
import AuthRouter from './auth';
import PostRouter from './post';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/posts', PostRouter);

router.get('/', (_req, res) => {
    res.send('why did you came here? fuckup');
});

export default router;
