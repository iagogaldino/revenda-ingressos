
import jwt from 'jsonwebtoken';
import { ITokenService } from '../interfaces/auth.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
if (!JWT_SECRET) {
  throw Error('process.env.JWT_SECRET null');
}

export class TokenService implements ITokenService {
  generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
