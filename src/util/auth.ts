import { NextFunction, Request, Response } from 'express';


export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  console.log(req.isAuthenticated());
  console.log(req.user);
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
  } else {
    next();
  }
}