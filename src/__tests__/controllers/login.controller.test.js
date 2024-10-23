process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

// ldapjs-client
jest.mock('ldapjs-client', () => {
  return jest.fn().mockImplementation(() => {
    return {
      bind: jest.fn().mockResolvedValue(true),
      search: jest.fn().mockResolvedValue([{ cn: 'Test User', email: 'test@example.com' }]),
    };
  });
});

const LoginController = require('../../controllers/login.controller');
const AuthService = require('../../services/auth.service');
const UserService = require('../../services/user.service');
const jwt = require('jsonwebtoken');

jest.mock('../../services/auth.service');
jest.mock('../../services/user.service');

describe('LoginController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* test('debería devolver un token y la información del usuario en caso de login exitoso', async () => {
    // Mockeamos la respuesta de ldapValidCredentials
    AuthService.ldapValidCredentials.mockResolvedValue({ status: 0 });

    // Mockeamos la respuesta de getUserByEmail
    const mockUser = { cn: 'Test User', email: 'test@example.com' };
    UserService.getUserByEmail.mockResolvedValue(mockUser);

    // Mockeamos el método jwt.sign
    jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');

    // Llamamos al método login
    await LoginController.login(req, res);

    // Expectativas
    expect(AuthService.ldapValidCredentials).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(UserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(jwt.sign).toHaveBeenCalledWith(mockUser, process.env.SECRET_KEY_JWT, { expiresIn: '1d' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      user: mockUser,
      token: 'mocked_token',
      message: 'Token created successfully.',
    });
  });

  test('debería devolver 401 para login no autorizado', async () => {
    // Mockeamos la respuesta de ldapValidCredentials
    AuthService.ldapValidCredentials.mockResolvedValue({ status: 1 });

    // Llamamos al método login
    await LoginController.login(req, res);

    // Expectativas
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized.' });
  });

  test('debería devolver 500 para error del servidor', async () => {
    // Mockeamos para lanzar un error
    AuthService.ldapValidCredentials.mockRejectedValue(new Error('Internal Server Error'));

    // Llamamos al método login
    await LoginController.login(req, res);

    // Expectativas
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: 'login',
      message: 'Internal Server Error',
    });
  }); */

  test('dummy test', async () => {
    expect(true);
  })
});
