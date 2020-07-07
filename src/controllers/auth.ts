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
export const login = [
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
      res.status(403).json({reason: 'AUTENTICATED'});
    } else {
      next();
    }
  },
  passport.authenticate('local', {failWithError: true}),
  (req: Request, res: Response) => {
    res.json({});
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
