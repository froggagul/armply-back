import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth';

export async function signup(req: Request, res: Response/*, next: NextFunction*/) {
    try {
    //   if (req.isAuthenticated()) {
    //     res.status(403).json({});
    //     return;
    //   }
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
  