import express from 'express';
import * as Controller from '../controllers/post';
import { checkAuthenticated } from '../util/auth';

const router = express.Router();

router.post('/post', checkAuthenticated, Controller.writePost)
router.put('/post/:id', checkAuthenticated, Controller.updatePost)
router.delete('/post/:id', checkAuthenticated, Controller.removePost);
export default router;
