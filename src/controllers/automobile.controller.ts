import { Request, Response, NextFunction } from 'express';
import { automobileService } from '../services/automobile.service';

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
      const { color, brand } = req.query;
      const automobiles = automobileService.findAll({
        color: color as string,
        brand: brand as string,
      });
      res.status(200).json({ status: 'success', data: automobiles });
    } catch (error) {
      next(error);
    }
  }

  public findById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const automobile = automobileService.findById(id);
      res.status(200).json({ status: 'success', data: automobile });
    } catch (error) {
      next(error);
    }
  }

  public update(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const data = req.body;
      const automobile = automobileService.update(id, data);
      res.status(200).json({ status: 'success', data: automobile });
    } catch (error) {
      next(error);
    }
  }

  public delete(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      automobileService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const automobileController = new AutomobileController();
