const LoginController = require('../../controllers/login.controller');
const AuthService = require('../../services/auth.service');
const UserService = require('../../services/user.service');
const LogsModel = require('../../models/Logs');
const jwt = require('jsonwebtoken');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock('../../services/auth.service');
jest.mock('../../services/user.service');
jest.mock('../../models/Logs');

describe('LoginController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: '1234'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

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

  test('debería devolver un token y la información del usuario en caso de login exitoso', async () => {
    // Mockeamos la respuesta de ldapValidCredentials
    AuthService.ldapValidCredentials.mockResolvedValue({ status: 0 });

    // Mockeamos la respuesta de getUserByEmail
    const mockUser = { cn: 'test@example.com' };
    UserService.getUserByEmail.mockResolvedValue(mockUser);

    // Mockeamos el método jwt.sign
    jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');

    // Mockeamos la respuesta de registerLog
    LogsModel.registerLog.mockResolvedValue(null);

    // Llamamos al método login
    await LoginController.login(req, res);

    // Expectativas
    expect(AuthService.ldapValidCredentials).toHaveBeenCalledWith('test@example.com', '1234');
    expect(UserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(jwt.sign).toHaveBeenCalledWith(mockUser, process.env.SECRET_KEY_JWT, { expiresIn: '1d' });
    expect(LogsModel.registerLog).toHaveBeenCalled();
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
  });
});
