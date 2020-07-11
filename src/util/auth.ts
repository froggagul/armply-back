import { NextFunction, Request, Response } from 'express';


export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
  } else {
    next();
  }
}