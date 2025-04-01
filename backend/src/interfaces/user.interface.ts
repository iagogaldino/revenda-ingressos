
export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  update(id: number, user: Partial<IUser>): Promise<IUser>;
  delete(id: number): Promise<void>;
}

export interface IUserService {
  create(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  update(id: number, user: Partial<IUser>): Promise<IUser>;
  delete(id: number): Promise<void>;
}
