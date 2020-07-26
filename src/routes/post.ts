import express from 'express';
import * as Controller from '../controllers/post';
import { checkAuthenticated } from '../util/auth';

const router = express.Router();

router.post('/post', checkAuthenticated, Controller.writePost)
router.put('/post/:id', checkAuthenticated, Controller.updatePost)
router.delete('/post/:id', checkAuthenticated, Controller.removePost);
router.get('/list', Controller.list)
router.get('/my', checkAuthenticated, Controller.my)
export default router;
