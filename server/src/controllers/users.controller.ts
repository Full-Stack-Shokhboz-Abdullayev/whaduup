import { Response } from 'express';
import { Not, Repository } from 'typeorm';
import { db } from '../config/db.config';
import { User } from '../models/user.model';
import { ExtendedRequest } from './auth.controller';

export class UsersController {
  constructor(private UserRepository: Repository<User>) {}
  async users(req: ExtendedRequest, res: Response) {
    const users = await this.UserRepository.find({
      select: ['id', 'username', 'createdAt', 'name'],
      where: {
        id: Not(req.user.id),
      },
    });
    res.status(200).json({
      success: true,
      users,
    });
  }
  async user(req: ExtendedRequest, res: Response) {
    const user = await this.UserRepository.findOne({
      select: ['id', 'username', 'createdAt', 'name'],
      where: {
        username: req.params.username,
        id: Not(req.user.id),
      },
    });
    res.status(200).json({
      success: true,
      user,
    });
  }
}

export default new UsersController(db.getRepository(User));
