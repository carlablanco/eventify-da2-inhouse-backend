const request = require('supertest');
const express = require('express');
const healthCheck = require('../routes/v1/healthCheck'); // Ruta de verificación de salud

const app = express();
app.use('/api/v1/health', healthCheck);

describe('GET /api/v1/health', () => {
  it('should return 200 and a success message', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Service is up and running');
  });
});
