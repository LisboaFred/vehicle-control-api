import { v4 as uuidv4 } from 'uuid';
import { automobileRepository } from '../repositories/automobile.repository';
import { Automobile } from '../models/automobile.model';
import { NotFoundError, ConflictError, BusinessRuleError } from '../errors/app-error';
import { usageRepository } from '../repositories/usage.repository';

class AutomobileService {
  public create(data: { licensePlate: string; color: string; brand: string }): Automobile {
    const existing = automobileRepository.findByLicensePlate(data.licensePlate);
    if (existing) {
      throw new ConflictError(
        `Automobile with license plate '${data.licensePlate}' already exists.`,
      );
    }

    const newAutomobile: Automobile = {
      id: uuidv4(),
      licensePlate: data.licensePlate,
      color: data.color,
      brand: data.brand,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return automobileRepository.create(newAutomobile);
  }

  public findAll(filters?: { color?: string; brand?: string }): Automobile[] {
    return automobileRepository.findAll(filters);
  }

  public findById(id: string): Automobile {
    const automobile = automobileRepository.findById(id);
    if (!automobile) {
      throw new NotFoundError('Automobile', id);
    }
    return automobile;
  }

  public update(id: string, data: { color?: string; brand?: string }): Automobile {
    this.findById(id);

    const updated = automobileRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Automobile', id);
    }
    return updated;
  }

  public delete(id: string): void {
    this.findById(id);

    if (usageRepository.findActiveUsageByAutomobileId(id)) {
      throw new BusinessRuleError('Cannot delete automobile with active usage');
    }

    automobileRepository.delete(id);
  }
}

export const automobileService = new AutomobileService();
