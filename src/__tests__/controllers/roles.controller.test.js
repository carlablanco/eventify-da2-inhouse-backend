const RoleController = require('../../controllers/roles.controller');
const RoleService = require('../../services/role.service');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock('../../services/role.service');

describe('RoleController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        module: 'artistas',
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

  test('debería devolver los roles de un módulo específico', async () => {
    // Mockeamos la respuesta de getRolesByModule
    RoleService.getRolesByModule.mockResolvedValue([{ role: "artistas" }]);

    // Llamamos al método getRolesByModule
    await RoleController.getRolesByModule(req, res);

    // Expectativas
    expect(RoleService.getRolesByModule).toHaveBeenCalledWith('artistas');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ role: "artistas" }]);
  });

  test('debería devolver 500 para error del servidor', async () => {
    // Mockeamos para lanzar un error
    RoleService.getRolesByModule.mockRejectedValue(new Error('Internal Server Error'));

    // Llamamos al método getRolesByModule
    await RoleController.getRolesByModule(req, res);

    // Expectativas
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: 'getRolesByModule',
      message: 'Internal Server Error',
    });
  });
});
