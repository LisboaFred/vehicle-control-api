import { v4 as uuidv4 } from 'uuid';
import { driverRepository } from '../repositories/driver.repository';
import { Driver } from '../models/driver.model';
import { NotFoundError } from '../errors/app-error';
// import { BusinessRuleError } from '../errors/app-error';

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
      throw new NotFoundError('Driver', id);
    }
    return driver;
  }

  public update(id: string, data: { name?: string }): Driver {
    // Ensure exists
    this.findById(id);

    const updated = driverRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Driver', id);
    }
    return updated;
  }

  public delete(id: string): void {
    // Ensure exists
    this.findById(id);

    // TODO: Validate active usage before deleting (Etapa 7)
    // if (hasActiveUsage(id)) throw new BusinessRuleError('Cannot delete driver with active usage');

    driverRepository.delete(id);
  }
}

export const driverService = new DriverService();
