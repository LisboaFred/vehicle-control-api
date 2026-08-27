import { Request, Response, NextFunction } from 'express';
import { driverService } from '../services/driver.service';
import { parsePagination, paginate } from '../utils/pagination';

class DriverController {
  public create(req: Request, res: Response, next: NextFunction): void {
    try {
      const data = req.body;
      const driver = driverService.create(data);
      res.status(201).json({ status: 'success', data: driver });
    } catch (error) {
      next(error);
    }
  }

  public findAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const { name, page, limit } = req.query;
      const drivers = driverService.findAll({
        name: name as string,
      });

      const pagination = parsePagination({ page: page as string, limit: limit as string });
      const result = paginate(drivers, pagination);

      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }

  public findById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const driver = driverService.findById(id);
      res.status(200).json({ status: 'success', data: driver });
    } catch (error) {
      next(error);
    }
  }

  public update(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const data = req.body;
      const driver = driverService.update(id, data);
      res.status(200).json({ status: 'success', data: driver });
    } catch (error) {
      next(error);
    }
  }

  public delete(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      driverService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const driverController = new DriverController();
