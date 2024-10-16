const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const validateJwt = require('../../middlewares/auth.middleware');


// Crear una aplicación Express para las pruebas
const app = express();
app.use(express.json());
app.post('/test', validateJwt, (req, res) => {
  res.send({ userId: req.userId });
});

// Mockear las variables de entorno
const SECRET_KEY_JWT = 'secretkey';
process.env.SECRET_KEY_JWT = SECRET_KEY_JWT;
process.env.NODE_ENV = 'test'; // Cambiamos a un entorno de prueba

// Mockear jwt.verify
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));


  it('should return 401 for invalid JWT', async () => {
    const { verify } = require('jsonwebtoken');
    verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const response = await request(app)
      .post('/test')
      .set('Authorization', 'Bearer invalidToken');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Usuario no autorizado' });
  });

  it('should return 401 on error', async () => {
    const { verify } = require('jsonwebtoken');
    verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const response = await request(app)
      .post('/test')
      .set('Authorization', 'Bearer');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Usuario no autorizado' });
  });
