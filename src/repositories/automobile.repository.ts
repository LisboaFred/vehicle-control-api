import { Automobile } from '../models/automobile.model';

class AutomobileRepository {
  private automobiles: Automobile[] = [];

  public create(automobile: Automobile): Automobile {
    this.automobiles.push(automobile);
    return automobile;
  }

  public findAll(filters?: { color?: string; brand?: string }): Automobile[] {
    let result = this.automobiles;
    if (filters?.color) {
      result = result.filter((a) => a.color.toLowerCase() === filters.color?.toLowerCase());
    }
    if (filters?.brand) {
      result = result.filter((a) => a.brand.toLowerCase() === filters.brand?.toLowerCase());
    }
    return result;
  }

  public findById(id: string): Automobile | undefined {
    return this.automobiles.find((a) => a.id === id);
  }

  public findByLicensePlate(licensePlate: string): Automobile | undefined {
    return this.automobiles.find((a) => a.licensePlate === licensePlate);
  }

  public update(
    id: string,
    data: Partial<Omit<Automobile, 'id' | 'createdAt' | 'licensePlate'>>,
  ): Automobile | undefined {
    const automobile = this.findById(id);
    if (!automobile) return undefined;

    Object.assign(automobile, { ...data, updatedAt: new Date() });
    return automobile;
  }

  public delete(id: string): boolean {
    const index = this.automobiles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.automobiles.splice(index, 1);
    return true;
  }
}

export const automobileRepository = new AutomobileRepository();
