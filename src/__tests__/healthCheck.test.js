const request = require('supertest');
const express = require('express');
const healthRouter = require('../routes/v1/healthCheck'); // Ajusta la ruta según la ubicación de tu archivo

const app = express();
app.use('/api/v1/health', healthRouter);

describe('GET /api/v1/health', () => {
  it('debería devolver un mensaje de que el servicio está funcionando', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Service is up and running');
  });
});
