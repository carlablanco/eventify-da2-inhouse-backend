process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

const request = require('supertest');
const express = require('express');
const RolesController = require('../../controllers/roles.controller');
const rolesRoutes = require('../../routes/v1/roles');
const validateJwtMdw = require('../../middlewares/auth.middleware');

jest.mock('../../controllers/roles.controller'); // Mock del RolesController

//Mockeamos que siempre se recibe un token válido
jest.mock('../../middlewares/auth.middleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/api/v1/roles', rolesRoutes); // Monta las rutas

describe('POST /api/v1/roles', () => {
  let req;

  beforeEach(() => {
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  test('obtiene todos los roles de un módulo', async () => {
    // Mockeamos la respuesta del controlador
    RolesController.getRolesByModule.mockImplementation(async (req, res) => {
      return res.status(200).json([]);
    });

    const response = await request(app)
      .get('/api/v1/roles?module=analitica');

    // Expectativas
    /* expect(response.status).toBe(200);
    expect(response.body).toEqual([]); */
    expect(response.body).toHaveBeenCalled();
  });
});
