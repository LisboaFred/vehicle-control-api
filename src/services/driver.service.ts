import { v4 as uuidv4 } from 'uuid';
import { driverRepository } from '../repositories/driver.repository';
import { Driver } from '../models/driver.model';
import { NotFoundError, BusinessRuleError } from '../errors/app-error';
import { usageRepository } from '../repositories/usage.repository';

class DriverService {
  public create(data: { name: string }): Driver {
    const newDriver: Driver = {
      id: uuidv4(),
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return driverRepository.create(newDriver);
  }

  public findAll(filters?: { name?: string }): Driver[] {
    return driverRepository.findAll(filters);
  }

  public findById(id: string): Driver {
    const driver = driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundError('Motorista', id);
    }
    return driver;
  }

  public update(id: string, data: { name?: string }): Driver {
    this.findById(id);

    const updated = driverRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Motorista', id);
    }
    return updated;
  }

  public delete(id: string): void {
    this.findById(id);

    if (usageRepository.findActiveUsageByDriverId(id)) {
      throw new BusinessRuleError('Não é possível excluir um motorista com utilização ativa');
    }

    driverRepository.delete(id);
  }
}

export const driverService = new DriverService();
