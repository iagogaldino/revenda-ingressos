import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
  tokenDecoded?: {
    saleID: number;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("authenticateToken");
  const token = req.headers["authorization"]?.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "";

  if (!JWT_SECRET) {
    throw Error("process.env.JWT_SECRET null");
  }

  if (!token) {
    res.status(401).json({ success: false, error: "Token não encontrado" });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      req.userId = decoded.userId;
      req.tokenDecoded = jwt.verify(token, JWT_SECRET) as any;
      next();
    } catch (err) {
      res.status(403).json({ success: false, error: "Token inválido" });
    }
  }
};
