const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const validateJwt = require('../../middlewares/auth.middleware');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

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

/*  it('should return 401 for invalid JWT', async () => {
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
 }); */
describe('AuthMiddleware', () => {
  let req, res;

  beforeEach(() => {
    if (!SHOW_CONSOLE_ERRORS)
      // Silencia console.error
      jest.spyOn(console, 'error').mockImplementation(() => { });

    if (!SHOW_CONSOLE_LOGS)
      // Silencia console.log
      jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();

    if (!SHOW_CONSOLE_ERRORS)
      // Restaura console.error
      console.error.mockRestore();

    if (!SHOW_CONSOLE_LOGS)
      // Restaura console.log
      console.log.mockRestore();
  });

  test('validateJwt debería llamar al callback', async () => {
    // Crea una función mock para el callback
    const mockCallback = jest.fn();

    // Llamamos al método validateJwt
    await validateJwt(req, res, mockCallback);

    // Expectativas
    // Verifica si el callback fue llamado
    expect(mockCallback).toHaveBeenCalled();
  });
});
