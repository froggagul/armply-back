// 사용자 모델 중 인증 및 인증 관리를 위한 서비스입니다. (사용자 관리는 포함되지 않음)
import express from 'express';
import passport from 'passport';
import * as AuthController from '../controllers/auth';
import { checkAuthenticated } from '../util/auth';

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/view', AuthController.viewEmail);
router.get('/my', checkAuthenticated, AuthController.getMyInfo);
router.delete('/logout', checkAuthenticated, AuthController.logout);
// oAuth 기능
router.get('/google', AuthController.googleLogin);
router.get('/google/redirect', AuthController.googleLogin);
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

export default router;
