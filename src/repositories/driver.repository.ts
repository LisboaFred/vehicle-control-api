import { Driver } from '../models/driver.model';

class DriverRepository {
  private drivers: Driver[] = [];

  public create(driver: Driver): Driver {
    this.drivers.push(driver);
    return driver;
  }

  public findAll(filters?: { name?: string }): Driver[] {
    let result = this.drivers;
    if (filters?.name) {
      // Partial match for names
      result = result.filter((d) => d.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    return result;
  }

  public findById(id: string): Driver | undefined {
    return this.drivers.find((d) => d.id === id);
  }

  public update(id: string, data: Partial<Omit<Driver, 'id' | 'createdAt'>>): Driver | undefined {
    const driver = this.findById(id);
    if (!driver) return undefined;

    Object.assign(driver, { ...data, updatedAt: new Date() });
    return driver;
  }

  public delete(id: string): boolean {
    const index = this.drivers.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.drivers.splice(index, 1);
    return true;
  }
}

export const driverRepository = new DriverRepository();
