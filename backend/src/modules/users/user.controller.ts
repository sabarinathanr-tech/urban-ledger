import type { Request, Response, NextFunction } from 'express';
import { userService } from './user.service.js';
import { sendSuccess } from '../../utils/response.js';

export class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      sendSuccess(res, 'User created successfully', { user }, 201);
    } catch (error) {
      next(error);
    }
  }

  public async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.listUsers(req.query);
      sendSuccess(res, 'Users retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  public async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.userId || '';
      const updated = await userService.toggleUserStatus(String(req.params.id), currentUserId);
      sendSuccess(res, 'User status updated successfully', { user: updated }, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
