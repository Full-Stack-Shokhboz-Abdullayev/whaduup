import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { db } from '../config/db.config';
import { User } from '../models/user.model';
import { comparePassword, encryptPassword } from '../utils/password.utils';

export interface ExtendedRequest extends Request {
  user: User;
}

export class AuthController {
  constructor(private UserRepository: Repository<User>) {}
  async register(req: Request, res: Response) {
    const body = req.body;

    const password = await encryptPassword(body.password);

    const { password: _, ...user } = await this.UserRepository.save({ ...body, password });

    res.status(201).json({
      success: true,
      user,
      auth: 'Basic ' + Buffer.from(user.username + ':' + password).toString('base64'),
    });
  }
  async login(req: Request, res: Response) {
    const body = req.body;

    const { username, password } = body;

    const user = await this.UserRepository.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found!',
      });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Credentials!',
      });
    }
    const { password: updatedPwd, ...updated } = await this.UserRepository.save({
      ...user,
      password: await encryptPassword(password),
    });
    const auth = 'Basic ' + Buffer.from(username + ':' + updatedPwd).toString('base64');

    return res.status(200).json({
      success: true,
      user: updated,
      auth,
    });
  }
  async checkAuth(req: ExtendedRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'No auth header!',
      });
    }
    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (!username || !password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid auth header!',
      });
    }
    const user = await this.UserRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found!',
      });
    }
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid auth token!',
      });
    }
    req.user = user;
    next();
  }
  async refresh(req: ExtendedRequest, res: Response) {
    const { password: _, ...user } = req.user;
    res.status(201).json({
      success: true,
      user,
      auth: 'Basic ' + Buffer.from(req.user.username + ':' + req.user.password).toString('base64'),
    });
  }
}

export default new AuthController(db.getRepository(User));
