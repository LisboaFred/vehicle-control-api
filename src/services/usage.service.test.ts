import { describe, it, expect, beforeEach } from '@jest/globals';
import { usageService } from './usage.service';
import { usageRepository } from '../repositories/usage.repository';
import { automobileService } from './automobile.service';
import { driverService } from './driver.service';
import { automobileRepository } from '../repositories/automobile.repository';
import { driverRepository } from '../repositories/driver.repository';
import { BusinessRuleError, NotFoundError } from '../errors/app-error';

beforeEach(() => {
  (usageRepository as any).usages = [];

  (automobileRepository as any).automobiles = [];

  (driverRepository as any).drivers = [];
});

describe('UsageService', () => {
  describe('create', () => {
    it('should create a usage when both driver and auto exist and are free', () => {
      const auto = automobileService.create({
        licensePlate: 'ABC-1234',
        color: 'Black',
        brand: 'Fiat',
      });
      const driver = driverService.create({ name: 'Ayrton Senna' });

      const usage = usageService.create({
        driverId: driver.id,
        automobileId: auto.id,
        reason: 'Business trip',
      });

      expect(usage.id).toBeDefined();
      expect(usage.driverId).toBe(driver.id);
      expect(usage.automobileId).toBe(auto.id);
      expect(usage.endDate).toBeNull();
    });

    it('should throw NotFoundError if driver does not exist', () => {
      const auto = automobileService.create({
        licensePlate: 'ABC-1234',
        color: 'Black',
        brand: 'Fiat',
      });

      expect(() =>
        usageService.create({
          driverId: 'invalid-id',
          automobileId: auto.id,
          reason: 'Business trip',
        }),
      ).toThrow(NotFoundError);
    });

    it('should throw NotFoundError if automobile does not exist', () => {
      const driver = driverService.create({ name: 'Ayrton Senna' });

      expect(() =>
        usageService.create({
          driverId: driver.id,
          automobileId: 'invalid-id',
          reason: 'Business trip',
        }),
      ).toThrow(NotFoundError);
    });

    it('should throw BusinessRuleError if automobile is already in use', () => {
      const auto = automobileService.create({
        licensePlate: 'ABC-1234',
        color: 'Black',
        brand: 'Fiat',
      });
      const driver1 = driverService.create({ name: 'Driver 1' });
      const driver2 = driverService.create({ name: 'Driver 2' });

      // Driver 1 uses auto
      usageService.create({ driverId: driver1.id, automobileId: auto.id, reason: 'Trip 1' });

      // Driver 2 tries to use same auto
      expect(() =>
        usageService.create({ driverId: driver2.id, automobileId: auto.id, reason: 'Trip 2' }),
      ).toThrow(BusinessRuleError);
    });

    it('should throw BusinessRuleError if driver already has an active usage', () => {
      const auto1 = automobileService.create({
        licensePlate: 'ABC-1111',
        color: 'Black',
        brand: 'Fiat',
      });
      const auto2 = automobileService.create({
        licensePlate: 'ABC-2222',
        color: 'White',
        brand: 'Ford',
      });
      const driver = driverService.create({ name: 'Driver 1' });

      // Driver uses auto 1
      usageService.create({ driverId: driver.id, automobileId: auto1.id, reason: 'Trip 1' });

      // Driver tries to use auto 2
      expect(() =>
        usageService.create({ driverId: driver.id, automobileId: auto2.id, reason: 'Trip 2' }),
      ).toThrow(BusinessRuleError);
    });
  });

  describe('finish', () => {
    it('should finish an active usage', () => {
      const auto = automobileService.create({
        licensePlate: 'ABC-1234',
        color: 'Black',
        brand: 'Fiat',
      });
      const driver = driverService.create({ name: 'Ayrton Senna' });
      const usage = usageService.create({
        driverId: driver.id,
        automobileId: auto.id,
        reason: 'Trip',
      });

      const finishedUsage = usageService.finish(usage.id);
      expect(finishedUsage.endDate).toBeDefined();
      expect(finishedUsage.endDate).not.toBeNull();
    });

    it('should throw BusinessRuleError if already finished', () => {
      const auto = automobileService.create({
        licensePlate: 'ABC-1234',
        color: 'Black',
        brand: 'Fiat',
      });
      const driver = driverService.create({ name: 'Ayrton Senna' });
      const usage = usageService.create({
        driverId: driver.id,
        automobileId: auto.id,
        reason: 'Trip',
      });

      usageService.finish(usage.id);

      expect(() => usageService.finish(usage.id)).toThrow(BusinessRuleError);
    });
  });

  describe('findAllWithDetails', () => {
    it('should return usages with automobile and driver objects', () => {
      const auto = automobileService.create({
        licensePlate: 'ABC-1234',
        color: 'Black',
        brand: 'Fiat',
      });
      const driver = driverService.create({ name: 'Ayrton Senna' });
      usageService.create({ driverId: driver.id, automobileId: auto.id, reason: 'Trip' });

      const results = usageService.findAllWithDetails();
      expect(results.length).toBe(1);
      expect(results[0].automobile.id).toBe(auto.id);
      expect(results[0].driver.id).toBe(driver.id);
    });
  });
});
