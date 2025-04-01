
import bcrypt from 'bcrypt';
import { IAuthService, IAuthCredentials, IAuthResponse } from '../interfaces/auth.interface';
import { ITokenService } from '../interfaces/auth.interface';
import { IUserRepository } from '../interfaces/user.interface';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService
  ) {}

  async login(credentials: IAuthCredentials): Promise<IAuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = this.tokenService.generateToken({ userId: user.id });

    return {
      user: {
        id: user.id!,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      this.tokenService.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }
}
