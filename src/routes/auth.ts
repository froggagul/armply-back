// 사용자 모델 중 인증 및 인증 관리를 위한 서비스입니다. (사용자 관리는 포함되지 않음)
import express from 'express';
import * as AuthController from '../controllers/auth';

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/view', AuthController.viewEmail);
router.get('/my', AuthController.getMyInfo);
router.delete('/logout', AuthController.logout);
// oAuth 기능

export default router;
