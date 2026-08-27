import { Request, Response, NextFunction } from 'express';
import { automobileService } from '../services/automobile.service';
import { parsePagination, paginate } from '../utils/pagination';

class AutomobileController {
  public create(req: Request, res: Response, next: NextFunction): void {
    try {
      const data = req.body;
      const automobile = automobileService.create(data);
      res.status(201).json({ status: 'success', data: automobile });
    } catch (error) {
      next(error);
    }
  }

  public findAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const { color, brand, page, limit } = req.query;
      const automobiles = automobileService.findAll({
        color: color as string,
        brand: brand as string,
      });

      const pagination = parsePagination({ page: page as string, limit: limit as string });
      const result = paginate(automobiles, pagination);

      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }

  public findById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const automobile = automobileService.findById(id);
      res.status(200).json({ status: 'success', data: automobile });
    } catch (error) {
      next(error);
    }
  }

  public update(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const data = req.body;
      const automobile = automobileService.update(id, data);
      res.status(200).json({ status: 'success', data: automobile });
    } catch (error) {
      next(error);
    }
  }

  public delete(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      automobileService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const automobileController = new AutomobileController();
