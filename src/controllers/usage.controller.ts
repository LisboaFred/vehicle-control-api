import { Request, Response, NextFunction } from 'express';
import { usageService } from '../services/usage.service';

class UsageController {
  public create(req: Request, res: Response, next: NextFunction): void {
    try {
      const data = req.body;
      const usage = usageService.create(data);
      res.status(201).json({ status: 'success', data: usage });
    } catch (error) {
      next(error);
    }
  }

  public finish(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const usage = usageService.finish(id);
      res.status(200).json({ status: 'success', data: usage });
    } catch (error) {
      next(error);
    }
  }

  public findAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const usages = usageService.findAllWithDetails();
      res.status(200).json({ status: 'success', data: usages });
    } catch (error) {
      next(error);
    }
  }
}

export const usageController = new UsageController();
