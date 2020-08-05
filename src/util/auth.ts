import { NextFunction, Request, Response } from 'express';
import User from '../modelType/user';


export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  console.log(req.isAuthenticated());
  console.log(req.user);
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
  } else {
    next();
  }
}

export function checkManager(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
  } else {
    if ((req.user as User).type === 'user') {
      res.status(401).json({reason: 'NOT MANAGER'});
    } else if ((req.user as User).type === 'manager') {
      next();
    } else {
      res.status(401).json({reason: 'UNKNOWN ERROR'});
    }
  }
}