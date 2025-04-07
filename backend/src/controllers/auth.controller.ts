
import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../interfaces/auth.interface';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      const isValid = await this.authService.validateToken(token);
      if (!isValid) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }

      res.json({ valid: true });
    } catch (error) {
      next(error);
    }
  }
}
