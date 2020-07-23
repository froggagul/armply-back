import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as AuthService from '../services/auth';

export async function signup(req: Request, res: Response/*, next: NextFunction*/) {
  try {
    if (req.isAuthenticated()) {
      res.status(403).json({});
      return;
    }
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
    if (req.isAuthenticated()) {
      console.log(req.user)
      res.json(req.user);
    }
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
    console.log(req);
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
  const { email } = req.body;
  const ret = await AuthService.emailView(email);
  console.log(ret);
  if (ret.success) {
    res.json({success: true});
  } else {
    res.json({success: false});
  }
}
