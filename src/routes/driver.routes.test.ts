import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { driverRepository } from '../repositories/driver.repository';

beforeEach(() => {
  (driverRepository as any).drivers = [];
});

describe('Driver Routes', () => {
  describe('POST /api/drivers', () => {
    it('should create a driver and return 201', async () => {
      const res = await request(app).post('/api/drivers').send({ name: 'Lewis Hamilton' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('Lewis Hamilton');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 for validation errors', async () => {
      const res = await request(app).post('/api/drivers').send({}); // Missing name

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.details).toBeDefined();
    });
  });

  describe('GET /api/drivers', () => {
    it('should return all drivers', async () => {
      await request(app).post('/api/drivers').send({ name: 'Driver A' });
      await request(app).post('/api/drivers').send({ name: 'Driver B' });

      const res = await request(app).get('/api/drivers');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should filter drivers by name', async () => {
      await request(app).post('/api/drivers').send({ name: 'Driver A' });
      await request(app).post('/api/drivers').send({ name: 'Driver B' });

      const res = await request(app).get('/api/drivers?name=Driver A');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Driver A');
    });
  });

  describe('GET /api/drivers/:id', () => {
    it('should return 404 if driver not found', async () => {
      const res = await request(app).get('/api/drivers/invalid-id');
      expect(res.status).toBe(404);
    });

    it('should return driver if found', async () => {
      const postRes = await request(app).post('/api/drivers').send({ name: 'Driver C' });

      const id = postRes.body.data.id;
      const res = await request(app).get(`/api/drivers/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(id);
    });
  });

  describe('PUT /api/drivers/:id', () => {
    it('should update an existing driver', async () => {
      const postRes = await request(app).post('/api/drivers').send({ name: 'Driver D' });

      const id = postRes.body.data.id;
      const res = await request(app).put(`/api/drivers/${id}`).send({ name: 'Driver E' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Driver E');
    });
  });

  describe('DELETE /api/drivers/:id', () => {
    it('should delete a driver and return 204', async () => {
      const postRes = await request(app).post('/api/drivers').send({ name: 'Driver F' });

      const id = postRes.body.data.id;
      const res = await request(app).delete(`/api/drivers/${id}`);

      expect(res.status).toBe(204);

      const getRes = await request(app).get(`/api/drivers/${id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
