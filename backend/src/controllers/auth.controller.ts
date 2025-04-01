
import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/auth.interface';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async validateToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const isValid = await this.authService.validateToken(token);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      res.json({ valid: true });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
