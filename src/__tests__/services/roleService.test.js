const { client } = require('../../utils/ldapConnect');
const RoleService = require("../../services/role.service");

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock('../../utils/ldapConnect', () => ({
  client: {
    search: jest.fn(),
  },
}));

describe("RoleService", () => {

  beforeEach(() => {
    jest.clearAllMocks();

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

  test('debería devolver todos los roles de un módulo', async () => {
    mockRoles = [
      {
        dn: 'cn=admin,ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'admin',
      },
      {
        dn: 'cn=artista,ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'artista',
      }
    ];

    client.search.mockResolvedValue(mockRoles);

    const result = await RoleService.getRolesByModule("analitica");

    expect(client.search).toHaveBeenCalled();
    expect(result).toHaveProperty('module', 'analitica');
  });

  test('debería lanzar un error si falla la búsqueda', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    await expect(RoleService.getRolesByModule()).rejects.toThrow('Error in getRolesByModule Service');
  });

});
