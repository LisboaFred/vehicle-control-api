import { describe, it, expect, beforeEach } from '@jest/globals';
import { driverService } from './driver.service';
import { driverRepository } from '../repositories/driver.repository';
import { NotFoundError } from '../errors/app-error';

beforeEach(() => {
  (driverRepository as any).drivers = [];
});

describe('DriverService', () => {
  describe('create', () => {
    it('should create a new driver', () => {
      const data = { name: 'Ayrton Senna' };
      const driver = driverService.create(data);

      expect(driver.id).toBeDefined();
      expect(driver.name).toBe(data.name);
      expect(driver.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findAll', () => {
    it('should return all drivers', () => {
      driverService.create({ name: 'Ayrton Senna' });
      driverService.create({ name: 'Rubens Barrichello' });

      const results = driverService.findAll();
      expect(results.length).toBe(2);
    });

    it('should filter by name (partial match)', () => {
      driverService.create({ name: 'Ayrton Senna' });
      driverService.create({ name: 'Rubens Barrichello' });

      const results = driverService.findAll({ name: 'senna' });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Ayrton Senna');
    });
  });

  describe('findById', () => {
    it('should return driver if found', () => {
      const driver = driverService.create({ name: 'Ayrton Senna' });
      const found = driverService.findById(driver.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(driver.id);
    });

    it('should throw NotFoundError if not found', () => {
      expect(() => driverService.findById('invalid-id')).toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('should update driver name', () => {
      const driver = driverService.create({ name: 'Ayrton Senna' });

      const updated = driverService.update(driver.id, { name: 'Rubens Barrichello' });
      expect(updated.name).toBe('Rubens Barrichello');
    });

    it('should throw NotFoundError if updating non-existent driver', () => {
      expect(() => driverService.update('invalid-id', { name: 'New Name' })).toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete driver', () => {
      const driver = driverService.create({ name: 'Ayrton Senna' });

      driverService.delete(driver.id);

      const results = driverService.findAll();
      expect(results.length).toBe(0);
    });

    it('should throw NotFoundError if deleting non-existent driver', () => {
      expect(() => driverService.delete('invalid-id')).toThrow(NotFoundError);
    });
  });
});
