import { Usage } from '../models/usage.model';

class UsageRepository {
  private usages: Usage[] = [];

  public create(usage: Usage): Usage {
    this.usages.push(usage);
    return usage;
  }

  public findAll(): Usage[] {
    return this.usages;
  }

  public findById(id: string): Usage | undefined {
    return this.usages.find((u) => u.id === id);
  }

  public update(id: string, data: Partial<Omit<Usage, 'id' | 'createdAt'>>): Usage | undefined {
    const usage = this.findById(id);
    if (!usage) return undefined;

    Object.assign(usage, { ...data, updatedAt: new Date() });
    return usage;
  }

  public findActiveUsageByAutomobileId(automobileId: string): Usage | undefined {
    return this.usages.find((u) => u.automobileId === automobileId && u.endDate === null);
  }

  public findActiveUsageByDriverId(driverId: string): Usage | undefined {
    return this.usages.find((u) => u.driverId === driverId && u.endDate === null);
  }
}

export const usageRepository = new UsageRepository();
