const jwt = require('jsonwebtoken');
const validateJwt = require('../../middlewares/auth.middleware');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

// Mockear las variables de entorno
const SECRET_KEY_JWT = 'secretkey';
process.env.SECRET_KEY_JWT = SECRET_KEY_JWT;
process.env.NODE_ENV = 'test'; // Cambiamos a un entorno de prueba

// Mockear jwt.verify
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  decode: jest.fn(),
}));


describe('AuthMiddleware', () => {
  let req, res;

  beforeEach(() => {
    req = {
      cookies: {
        token: 'token',
      }
    };

    res = {
      cookie: jest.fn(),
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

  test('validateJwt debería llamar al callback', async () => {
    // Crea una función mock para el callback
    const mockCallback = jest.fn();

    // Mockeamos el método jwt.verify
    jest.spyOn(jwt, 'verify').mockReturnValue(true);

    // Mockeamos el método jwt.decode
    jest.spyOn(jwt, 'decode').mockReturnValue('mocked_token');

    // Llamamos al método validateJwt
    await validateJwt(req, res, mockCallback);

    // Expectativas
    // Verifica si el callback fue llamado
    expect(mockCallback).toHaveBeenCalled();
  });



  test('should return 401 for invalid JWT', async () => {
    jest.spyOn(jwt, 'verify').mockReturnValue(false);

    // Llamamos al método validateJwt
    await validateJwt(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token invalido"
    });
  });

  test('should return 401 on non provided token', async () => {
    const req = {};

    // Llamamos al método validateJwt
    await validateJwt(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No hay token provisto"
    });
  });
});
