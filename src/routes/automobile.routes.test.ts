import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { automobileRepository } from '../repositories/automobile.repository';

beforeEach(() => {
  (automobileRepository as any).automobiles = [];
});

describe('Automobile Routes', () => {
  describe('POST /api/automobiles', () => {
    it('should create an automobile and return 201', async () => {
      const res = await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'XYZ-9876', color: 'Red', brand: 'Toyota' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.licensePlate).toBe('XYZ-9876');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 for validation errors', async () => {
      const res = await request(app).post('/api/automobiles').send({ color: 'Red' }); // Missing licensePlate and brand

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.details).toBeDefined();
    });

    it('should return 409 if license plate already exists', async () => {
      const data = { licensePlate: 'XYZ-9876', color: 'Red', brand: 'Toyota' };
      await request(app).post('/api/automobiles').send(data);

      const res = await request(app).post('/api/automobiles').send(data);
      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/automobiles', () => {
    it('should return all automobiles', async () => {
      await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'ABC-1', color: 'Red', brand: 'A' });
      await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'ABC-2', color: 'Blue', brand: 'B' });

      const res = await request(app).get('/api/automobiles');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should filter automobiles by color', async () => {
      await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'ABC-1', color: 'Red', brand: 'A' });
      await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'ABC-2', color: 'Blue', brand: 'B' });

      const res = await request(app).get('/api/automobiles?color=Red');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].licensePlate).toBe('ABC-1');
    });
  });

  describe('GET /api/automobiles/:id', () => {
    it('should return 404 if automobile not found', async () => {
      const res = await request(app).get('/api/automobiles/invalid-id');
      expect(res.status).toBe(404);
    });

    it('should return automobile if found', async () => {
      const postRes = await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'XYZ-1', color: 'Red', brand: 'A' });

      const id = postRes.body.data.id;
      const res = await request(app).get(`/api/automobiles/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(id);
    });
  });

  describe('PUT /api/automobiles/:id', () => {
    it('should update an existing automobile', async () => {
      const postRes = await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'XYZ-1', color: 'Red', brand: 'A' });

      const id = postRes.body.data.id;
      const res = await request(app).put(`/api/automobiles/${id}`).send({ color: 'Blue' });

      expect(res.status).toBe(200);
      expect(res.body.data.color).toBe('Blue');
      expect(res.body.data.licensePlate).toBe('XYZ-1'); // should not change
    });
  });

  describe('DELETE /api/automobiles/:id', () => {
    it('should delete an automobile and return 204', async () => {
      const postRes = await request(app)
        .post('/api/automobiles')
        .send({ licensePlate: 'XYZ-1', color: 'Red', brand: 'A' });

      const id = postRes.body.data.id;
      const res = await request(app).delete(`/api/automobiles/${id}`);

      expect(res.status).toBe(204);

      const getRes = await request(app).get(`/api/automobiles/${id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
