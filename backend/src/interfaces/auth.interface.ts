
export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

export interface IAuthService {
  login(credentials: IAuthCredentials): Promise<IAuthResponse>;
  validateToken(token: string): Promise<boolean>;
}

export interface ITokenService {
  generateToken(payload: any): string;
  verifyToken(token: string): any;
}
