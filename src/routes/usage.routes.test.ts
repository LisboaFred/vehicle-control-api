import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { usageRepository } from '../repositories/usage.repository';
import { automobileRepository } from '../repositories/automobile.repository';
import { driverRepository } from '../repositories/driver.repository';
import { automobileService } from '../services/automobile.service';
import { driverService } from '../services/driver.service';

beforeEach(() => {
  
  (usageRepository as any).usages = [];
  
  (automobileRepository as any).automobiles = [];
  
  (driverRepository as any).drivers = [];
});

describe('Usage Routes', () => {
  describe('POST /api/usages', () => {
    it('should create usage and return 201', async () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1', color: 'Red', brand: 'A' });
      const driver = driverService.create({ name: 'Driver A' });

      const res = await request(app)
        .post('/api/usages')
        .send({ driverId: driver.id, automobileId: auto.id, reason: 'Test' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 for validation errors', async () => {
      const res = await request(app).post('/api/usages').send({ driverId: 'not-a-uuid' }); // Missing other fields and invalid uuid

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return 422 if auto is already in use', async () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1', color: 'Red', brand: 'A' });
      const driver1 = driverService.create({ name: 'Driver A' });
      const driver2 = driverService.create({ name: 'Driver B' });

      // Driver 1 uses auto
      await request(app)
        .post('/api/usages')
        .send({ driverId: driver1.id, automobileId: auto.id, reason: 'Test 1' });

      // Driver 2 tries to use auto
      const res = await request(app)
        .post('/api/usages')
        .send({ driverId: driver2.id, automobileId: auto.id, reason: 'Test 2' });

      expect(res.status).toBe(422);
      expect(res.body.status).toBe('error');
    });
  });

  describe('PATCH /api/usages/:id/finish', () => {
    it('should finish usage', async () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1', color: 'Red', brand: 'A' });
      const driver = driverService.create({ name: 'Driver A' });

      const postRes = await request(app)
        .post('/api/usages')
        .send({ driverId: driver.id, automobileId: auto.id, reason: 'Test' });

      const id = postRes.body.data.id;

      const res = await request(app).patch(`/api/usages/${id}/finish`);

      expect(res.status).toBe(200);
      expect(res.body.data.endDate).toBeDefined();
      expect(res.body.data.endDate).not.toBeNull();
    });

    it('should return 404 if usage not found', async () => {
      const res = await request(app).patch('/api/usages/invalid-id/finish');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/usages', () => {
    it('should return all usages with populated driver and automobile details', async () => {
      const auto = automobileService.create({ licensePlate: 'ABC-1', color: 'Red', brand: 'A' });
      const driver = driverService.create({ name: 'Driver A' });

      await request(app)
        .post('/api/usages')
        .send({ driverId: driver.id, automobileId: auto.id, reason: 'Test' });

      const res = await request(app).get('/api/usages');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].automobile.licensePlate).toBe('ABC-1');
      expect(res.body.data[0].driver.name).toBe('Driver A');
    });
  });
});
