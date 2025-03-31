
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const MOCK_USER = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User'
};

const JWT_SECRET = 'your-secret-key';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Mock validation
    if (email === MOCK_USER.email && password === 'password') {
      const token = jwt.sign({ userId: MOCK_USER.id }, JWT_SECRET, { expiresIn: '1h' });
      
      res.json({
        user: MOCK_USER,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  static async getUser(req: Request, res: Response) {
    // Mock user retrieval
    res.json(MOCK_USER);
  }

  static async logout(req: Request, res: Response) {
    res.json({ message: 'Logged out successfully' });
  }
}
