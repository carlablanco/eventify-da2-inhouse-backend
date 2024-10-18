// loginRoute.test.js
process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

const request = require('supertest');
const express = require('express');
const LoginController = require('../../controllers/login.controller');
const authRoutes = require('../../routes/v1/login'); // Asegúrate de la ruta correcta

jest.mock('../../controllers/login.controller'); // Mock del LoginController

// Mock de ldapjs-client
jest.mock('ldapjs-client', () => {
  return jest.fn().mockImplementation(() => {
    return {
      bind: jest.fn().mockResolvedValue(true), // Mock del método bind
      search: jest.fn().mockResolvedValue([{ cn: 'Test User', email: 'test@example.com' }]), // Mock del método search
    };
  });
});

const app = express();
app.use(express.json());
app.use('/api/v1/login', authRoutes); // Monta las rutas

describe('POST /api/v1/login', () => {
  let req;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  test('debería iniciar sesión exitosamente y devolver un token', async () => {
    // Mockeamos la respuesta del controlador
    LoginController.login.mockImplementation(async (req, res) => {
      return res.status(200).json({
        status: 200,
        user: { email: req.body.email },
        token: 'mocked_token',
        message: 'Token created successfully.',
      });
    });

    const response = await request(app)
      .post('/api/v1/login')
      .send(req.body);

    // Expectativas
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      user: { email: req.body.email },
      token: 'mocked_token',
      message: 'Token created successfully.',
    });
  });

  test('debería devolver 401 si las credenciales son inválidas', async () => {
    // Mockeamos la respuesta del controlador para el caso no autorizado
    LoginController.login.mockImplementation(async (req, res) => {
      return res.status(401).json({ message: 'Unauthorized.' });
    });

    const response = await request(app)
      .post('/api/v1/login')
      .send(req.body);

    // Expectativas
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized.' });
  });


  test('debería devolver 400 si faltan campos obligatorios', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({}); // Enviamos un cuerpo vacío

    // Expectativas
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined(); // Aseguramos que haya errores
  });
});
