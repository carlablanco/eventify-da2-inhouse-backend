const LogsController = require('../../controllers/logs.controller');
const LogsService = require('../../services/logs.service');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock('../../services/logs.service');

describe('LogsController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        mail: 'test@example.com',
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

  test('debería devolver un listado de logs', async () => {
    // Mockeamos la respuesta de LogsService.getLogs
    LogsService.getLogs.mockResolvedValue([]);

    // Llamamos al método getLogs
    await LogsController.getLogs(req, res);

    // Expectativas
    expect(LogsService.getLogs).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('debería devolver 500 para error del servidor', async () => {
    // Mockeamos para lanzar un error
    LogsService.getLogs.mockRejectedValue(new Error('Internal Server Error'));

    // Llamamos al método getLogs
    await LogsController.getLogs(req, res);

    // Expectativas
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: 'getLogs',
      message: 'Internal Server Error',
    });
  });

  test('debería devolver un listado de logs por mail', async () => {
    // Mockeamos la respuesta de LogsService.getLogs
    LogsService.getLogs.mockResolvedValue([]);

    // Llamamos al método getLogsByMail
    await LogsController.getLogsByMail(req, res);

    // Expectativas
    expect(LogsService.getLogs).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('debería devolver 500 para error del servidor', async () => {
    // Mockeamos para lanzar un error
    LogsService.getLogs.mockRejectedValue(new Error('Internal Server Error'));

    // Llamamos al método getLogsByMail
    await LogsController.getLogsByMail(req, res);

    // Expectativas
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: 'getLogsByMail',
      message: 'Internal Server Error',
    });
  });
});
