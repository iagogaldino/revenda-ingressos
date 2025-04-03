import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET || '';

  if (!JWT_SECRET) {
    throw Error('process.env.JWT_SECRET null');
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token não encontrado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Token inválido' });
  }
};
