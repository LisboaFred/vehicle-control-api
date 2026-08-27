import { v4 as uuidv4 } from 'uuid';
import { usageRepository } from '../repositories/usage.repository';
import { automobileService } from './automobile.service';
import { driverService } from './driver.service';
import { Usage } from '../models/usage.model';
import { NotFoundError, BusinessRuleError } from '../errors/app-error';
import { Automobile } from '../models/automobile.model';
import { Driver } from '../models/driver.model';

class UsageService {
  public create(data: { driverId: string; automobileId: string; reason: string }): Usage {
    driverService.findById(data.driverId);
    automobileService.findById(data.automobileId);

    const activeAutoUsage = usageRepository.findActiveUsageByAutomobileId(data.automobileId);
    if (activeAutoUsage) {
      throw new BusinessRuleError('Automobile is already in use by another driver.');
    }

    const activeDriverUsage = usageRepository.findActiveUsageByDriverId(data.driverId);
    if (activeDriverUsage) {
      throw new BusinessRuleError('Driver already has an active automobile usage.');
    }

    const newUsage: Usage = {
      id: uuidv4(),
      startDate: new Date(),
      endDate: null,
      driverId: data.driverId,
      automobileId: data.automobileId,
      reason: data.reason,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return usageRepository.create(newUsage);
  }

  public finish(id: string): Usage {
    const usage = usageRepository.findById(id);
    if (!usage) {
      throw new NotFoundError('Usage', id);
    }

    if (usage.endDate !== null) {
      throw new BusinessRuleError('Usage is already finished.');
    }

    return usageRepository.update(id, { endDate: new Date() })!;
  }

  public findAllWithDetails(filters?: {
    driverId?: string;
  }): Array<Usage & { automobile: Automobile; driver: Driver }> {
    let usages = usageRepository.findAll();

    if (filters?.driverId) {
      usages = usages.filter((u) => u.driverId === filters.driverId);
    }

    return usages.map((usage) => ({
      ...usage,
      automobile: automobileService.findById(usage.automobileId),
      driver: driverService.findById(usage.driverId),
    }));
  }
}

export const usageService = new UsageService();
