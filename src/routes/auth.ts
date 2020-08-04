// 사용자 모델 중 인증 및 인증 관리를 위한 서비스입니다. (사용자 관리는 포함되지 않음)
import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import * as AuthController from '../controllers/auth';
import { checkAuthenticated } from '../util/auth';

dotenv.config();

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/view', AuthController.viewEmail);
router.get('/my', checkAuthenticated, AuthController.getMyInfo);
router.delete('/logout', checkAuthenticated, AuthController.logout);
// oAuth 기능
const CLIENT_HOME_PAGE_URL = process.env.FRONT_URL;
router.get('/google', AuthController.googleLogin);
router.get('/google/redirect', passport.authenticate('google', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: `${CLIENT_HOME_PAGE_URL}/login`,
    scope: ['profile', 'email']
  }));
router.get('/facebook', AuthController.facebookLogin);
router.get('/facebook/redirect', passport.authenticate('facebook', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: `${CLIENT_HOME_PAGE_URL}/login`,
    scope: ['email']
  }));

export default router;
