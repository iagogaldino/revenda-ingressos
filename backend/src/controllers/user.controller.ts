
import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../interfaces/user.interface';

export class UserController {
  constructor(private readonly userService: IUserService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.findById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.update(Number(req.params.id), req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.userService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
