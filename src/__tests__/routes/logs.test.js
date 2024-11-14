process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

const request = require('supertest');
const express = require('express');
const LogsController = require('../../controllers/logs.controller');
const logsRoutes = require('../../routes/v1/logs');
const validateJwtMdw = require('../../middlewares/auth.middleware');

jest.mock('../../controllers/logs.controller'); // Mock del LogsController

//Mockeamos que siempre se recibe un token válido
jest.mock('../../middlewares/auth.middleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/api/v1/logs', logsRoutes); // Monta las rutas

describe('POST /api/v1/logs', () => {
  let req;

  beforeEach(() => {
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  test('obtiene todos los logs', async () => {
    // Mockeamos la respuesta del controlador
    LogsController.getLogs.mockImplementation(async (req, res) => {
      return res.status(200).json([]);
    });

    const response = await request(app)
      .get('/api/v1/logs');

    // Expectativas
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('obtiene todos los logs de un email', async () => {
    // Mockeamos la respuesta del controlador
    LogsController.getLogsByMail.mockImplementation(async (req, res) => {
      return res.status(200).json([]);
    });

    const response = await request(app)
      .get('/api/v1/logs?mail=test@example.com');

    // Expectativas
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
