import { Request, Response, NextFunction } from 'express';
import { usageService } from '../services/usage.service';
import { parsePagination, paginate } from '../utils/pagination';

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
      const { driverId, page, limit } = req.query;
      const usages = usageService.findAllWithDetails({
        driverId: driverId as string,
      });

      const pagination = parsePagination({ page: page as string, limit: limit as string });
      const result = paginate(usages, pagination);

      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }
}

export const usageController = new UsageController();
