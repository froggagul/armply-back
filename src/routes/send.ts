import express from 'express';
import { checkManager } from '../util/auth';
import * as PostController from '../controllers/post';

const router = express.Router();

router.get('/last', checkManager, PostController.send);
router.post('/sended', checkManager, PostController.sendAndUpdatePost);

export default router;