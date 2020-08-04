import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import * as AuthService from '../services/auth';
import { UserDoc } from '../models/user';
import PostModel from '../models/post';

dotenv.config();

export async function signup(req: Request, res: Response/*, next: NextFunction*/) {
  try {
    if (req.isAuthenticated()) {
      res.status(403).json({});
      return;
    }
    console.log('reqbody', req.body);
    const result = await AuthService.create(req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({reason: result.reason});
    }
  } catch (err) {
    // next(err);
  }
}

export async function getMyInfo(req: Request, res: Response) {
  try{
    console.log(req.user);
    const cnt = await PostModel.find({author: (req.user as UserDoc)._id}).count();
    const {email, name, username,_id} = req.user as UserDoc;
    res.json({
      email,
      name,
      username,
      _id,
      replyCount: cnt
    });
  } catch (err) {
    return ('err');
  }
}

export const login = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({reason: 'AUTENTICATED'});
    } else {
      next();
    }
  },
  passport.authenticate('local', {failWithError: true}),
  (req: Request, res: Response) => {
    res.json({success: true});
  },
  (err: any, req: Request, res: Response, __: NextFunction) => {
    /**
     * @see AuthService.authenticate reason values
     */
    if (err === 'BAD_CREDENTIALS') {
      res.status(401).json({reason: err});
    } else if (err === 'INACTIVE') {
      res.status(403).json({reason: err});
    } else {
      console.log(`Uncaught error during authentication: ${err}`);
      res.status(500).json({});
    }
  }
];

const CLIENT_HOME_PAGE_URL = process.env.FRONT_URL;

export const googleLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({reason: 'AUTENTICATED'});
    } else {
      next();
    }
  },
  passport.authenticate('google', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: `${CLIENT_HOME_PAGE_URL}/login`,
    scope: ['profile', 'email']
  }),
  (req: Request, res: Response) => {
    res.json({success: true});
  },
  (err: any, req: Request, res: Response, __: NextFunction) => {
    /**
     * @see AuthService.authenticate reason values
     */
    if (err === 'BAD_CREDENTIALS') {
      res.status(401).json({reason: err});
    } else if (err === 'INACTIVE') {
      res.status(403).json({reason: err});
    } else {
      console.log(`Uncaught error during authentication: ${err}`);
      res.status(500).json({});
    }
  }
];

export const facebookLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.status(403).json({reason: 'AUTENTICATED'});
    } else {
      next();
    }
  },
  passport.authenticate('facebook', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: `${CLIENT_HOME_PAGE_URL}/login`,
    scope: ['email']
  }),
  (req: Request, res: Response) => {
    res.json({success: true});
  },
  (err: any, req: Request, res: Response, __: NextFunction) => {
    /**
     * @see AuthService.authenticate reason values
     */
    if (err === 'BAD_CREDENTIALS') {
      res.status(401).json({reason: err});
    } else if (err === 'INACTIVE') {
      res.status(403).json({reason: err});
    } else {
      console.log(`Uncaught error during authentication: ${err}`);
      res.status(500).json({});
    }
  }
];

export function logout(req: Request, res: Response) {
  req.logout();
  res.json({success: true});
}

export async function viewEmail(req: Request, res: Response, next: NextFunction) {
  const { email, loginType } = req.body;
  const ret = await AuthService.emailView(email, loginType);
  if (ret.success) {
    res.json({success: true});
  } else {
    res.json({success: false});
  }
}
