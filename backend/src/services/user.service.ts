
import { IUser, IUserRepository, IUserService } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create(user: IUser): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userRepository.create({
      ...user,
      password: hashedPassword
    });

    return {
      ...newUser,
      password: undefined
    } as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async update(id: number, user: Partial<IUser>): Promise<IUser> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
