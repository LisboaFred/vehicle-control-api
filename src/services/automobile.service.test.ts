import { describe, it, expect, beforeEach } from '@jest/globals';
import { automobileService } from './automobile.service';
import { automobileRepository } from '../repositories/automobile.repository';
import { ConflictError, NotFoundError } from '../errors/app-error';

// Clear the in-memory array before each test to prevent test pollution
beforeEach(() => {
  // @ts-ignore - Accessing private property for testing purposes
  automobileRepository.automobiles = [];
});

describe('AutomobileService', () => {
  describe('create', () => {
    it('should create a new automobile', () => {
      const data = { licensePlate: 'ABC-1234', color: 'Black', brand: 'Fiat' };
      const auto = automobileService.create(data);

      expect(auto.id).toBeDefined();
      expect(auto.licensePlate).toBe(data.licensePlate);
      expect(auto.color).toBe(data.color);
      expect(auto.brand).toBe(data.brand);
      expect(auto.createdAt).toBeInstanceOf(Date);
    });

    it('should throw ConflictError if license plate already exists', () => {
      const data = { licensePlate: 'ABC-1234', color: 'Black', brand: 'Fiat' };
      automobileService.create(data);

      expect(() => automobileService.create(data)).toThrow(ConflictError);
    });
  });

  describe('findAll', () => {
    it('should return all automobiles when no filters are applied', () => {
      automobileService.create({ licensePlate: 'ABC-1111', color: 'Black', brand: 'Fiat' });
      automobileService.create({ licensePlate: 'ABC-2222', color: 'White', brand: 'Ford' });

      const results = automobileService.findAll();
      expect(results.length).toBe(2);
    });

    it('should filter by color and brand', () => {
      automobileService.create({ licensePlate: 'ABC-1111', color: 'Black', brand: 'Fiat' });
      automobileService.create({ licensePlate: 'ABC-2222', color: 'White', brand: 'Fiat' });
      
      const resultsColor = automobileService.findAll({ color: 'Black' });
      expect(resultsColor.length).toBe(1);
      expect(resultsColor[0].licensePlate).toBe('ABC-1111');

      const resultsBrand = automobileService.findAll({ brand: 'fiat' }); // case-insensitive test
      expect(resultsBrand.length).toBe(2);
    });
  });

  describe('findById', () => {
    it('should return automobile if found', () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1234', color: 'Black', brand: 'Fiat' });
      const found = automobileService.findById(auto.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(auto.id);
    });

    it('should throw NotFoundError if not found', () => {
      expect(() => automobileService.findById('invalid-id')).toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('should update automobile color and brand', () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1234', color: 'Black', brand: 'Fiat' });
      
      const updated = automobileService.update(auto.id, { color: 'White', brand: 'Ford' });
      expect(updated.color).toBe('White');
      expect(updated.brand).toBe('Ford');
    });

    it('should throw NotFoundError if updating non-existent automobile', () => {
      expect(() => automobileService.update('invalid-id', { color: 'White' })).toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete automobile', () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1234', color: 'Black', brand: 'Fiat' });
      
      automobileService.delete(auto.id);
      
      const results = automobileService.findAll();
      expect(results.length).toBe(0);
    });

    it('should throw NotFoundError if deleting non-existent automobile', () => {
      expect(() => automobileService.delete('invalid-id')).toThrow(NotFoundError);
    });
  });
});
