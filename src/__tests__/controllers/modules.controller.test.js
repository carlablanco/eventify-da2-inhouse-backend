process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

const ModuleController = require('../../controllers/modules.controller');
const ModuleService = require('../../services/module.service');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock('../../services/module.service');

describe('ModulesController', () => {
  let req, res;

  beforeEach(() => {
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
    if (!SHOW_CONSOLE_ERRORS)
      // Restaura console.error
      console.error.mockRestore();

    if (!SHOW_CONSOLE_LOGS)
      // Restaura console.log
      console.log.mockRestore();
  });

  test('debería devolver un listado de módulos', async () => {
    // Mockeamos la respuesta de getModules
    ModuleService.getModules.mockResolvedValue([]);

    // Llamamos al método getModules
    await ModuleController.getModules(req, res);

    // Expectativas
    expect(ModuleService.getModules).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('debería devolver 500 para error del servidor', async () => {
    // Mockeamos para lanzar un error
    ModuleService.getModules.mockRejectedValue(new Error('Internal Server Error'));

    // Llamamos al método getModules
    await ModuleController.getModules(req, res);

    // Expectativas
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: 'getModules',
      message: 'Internal Server Error',
    });
  });
});
