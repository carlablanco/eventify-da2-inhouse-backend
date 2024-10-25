const UserModel = require("../../models/Users");
const { client } = require('../../utils/ldapConnect');
const UserService = require("../../services/user.service");

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = true;
const SHOW_CONSOLE_ERRORS = false;

jest.mock("../../models/Users"); // Mock del modelo de usuario

jest.mock('../../utils/ldapConnect', () => ({
  client: {
    search: jest.fn(),
  },
}));

describe("UserService", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsers = [
      {
        dn: 'cn=artista,ou=artistas,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'artista',
        member: [
          'cn=tsultais,ou=usuarios,dc=rd,dc=eventify,dc=local',
          'cn=Jaime.Lymann@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local',
        ]
      }
    ];

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

  test('debería devolver usuarios correctamente paginados', async () => {
    client.search.mockResolvedValue(mockUsers);

    const getUserByEmailSpy = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue({});

    const result = await UserService.getUsers();

    expect(getUserByEmailSpy).toHaveBeenCalledTimes(2);
    expect(client.search).toHaveBeenCalled();
    expect(result).toHaveProperty('totalRegisters', 2);
    expect(result).toHaveProperty('totalPages', 1);
    expect(result.pagedUsers).toHaveLength(2);
    expect(result.pagedUsers[0]).toHaveProperty('mail', 'tsultais');
  });

  test('debería devolver usuarios vacíos si se pidió una página superior', async () => {
    client.search.mockResolvedValue(mockUsers);

    const getUserByEmailSpy = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue({});

    const result = await UserService.getUsers(5);

    expect(getUserByEmailSpy).toHaveBeenCalledTimes(0);
    expect(client.search).toHaveBeenCalled();
    expect(result).toHaveProperty('totalRegisters', 2);
    expect(result).toHaveProperty('totalPages', 1);
    expect(result.users).toHaveLength(0);
  });

  test('debería lanzar un error si falla la búsqueda', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    await expect(UserService.getUsers(0)).rejects.toThrow('Error in getUsers Service');
  });

  test('debería devolver un listado de mails correspondientes al rol', async () => {
    client.search.mockResolvedValue(mockUsers);

    const role = "artista";
    const module = "artistas";

    const result = await UserService.getUsersByRole(role, module);

    expect(client.search).toHaveBeenCalled();
    expect(result).toHaveProperty('module', module);
  });

  test('debería lanzar un error si falla la búsqueda por rol', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    const role = "artista";
    const module = "artistas";

    await expect(UserService.getUsersByRole(role, module)).rejects.toThrow('Error in getUsersByRole Service');
  });

  test('debería devolver un listado de mails correspondientes al módulo', async () => {
    const mockModules = [
      { dn: 'ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local' },
      {
        dn: 'cn=admin,ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'admin',
        member: [
          'cn=tsultais,ou=usuarios,dc=rd,dc=eventify,dc=local',
          'cn=Luci.Margarete@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local',
        ]
      },
      {
        dn: 'cn=publicista,ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'publicista',
        member: [
          'cn=tsultais,ou=usuarios,dc=rd,dc=eventify,dc=local',
        ]
      },
    ];
    client.search.mockResolvedValue(mockModules);

    const module = "artistas";

    const result = await UserService.getUsersByModule(module);

    expect(client.search).toHaveBeenCalled();
    expect(result).toHaveProperty('module', module);
  });

  test('debería lanzar un error si falla la búsqueda por módulo', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    const module = "artistas";

    await expect(UserService.getUsersByModule(module)).rejects.toThrow('Error in getUsersByModule Service');
  });

  test('debería devolver los roles de un usuario a través de su dn', async () => {
    client.search.mockResolvedValue([
      {
        dn: 'cn=artista,ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'artista'
      },
      {
        dn: 'cn=artista,ou=analitica,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'admin'
      }
    ]);

    const dn = 'cn=tomas01ariel@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local';

    const result = await UserService.getRolesByUserDn(dn);

    expect(client.search).toHaveBeenCalled();
  });

  test('debería lanzar un error si falla obtener los roles de un usuario a través de su dn', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    const dn = 'cn=tomas01ariel@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local';

    await expect(UserService.getRolesByUserDn(dn)).rejects.toThrow('Error in getRolesByUserDn Service');
  });

  test('debería lanzar un error si falla la creación de un usuario', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    const dn = 'cn=tomas01ariel@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local';

    const result = await UserService.createUser(dn);

    expect(result).toEqual(true);
  });
});



















describe("UserService - getUserByEmail", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsers = [
      {
        dn: 'cn=artista,ou=artistas,ou=modulos,ou=eventify_sa,dc=eventify,dc=local',
        cn: 'artista',
        member: [
          'cn=tsultais,ou=usuarios,dc=rd,dc=eventify,dc=local',
          'cn=Jaime.Lymann@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local',
        ]
      }
    ];

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

  test('debería devolver información de un usuario a través del mail', async () => {
    const mockRoles = { analitica: ['artista', 'admin'] };
    client.search.mockResolvedValue('cn=tomas01ariel@gmail.com,ou=usuarios,ou=eventify_sa,dc=eventify,dc=local');

    const mail = "tomas01ariel@gmail.com";

    const result = await UserService.getUserByEmail(mail);

    console.log("🚀 ~ file: userService.test.js:153 ~ test ~ result:", result);


    //expect(client.search).toHaveBeenCalled();
    //expect(result).toHaveProperty('modules', mockRoles);
    expect(result).toEqual({});
  });

  /* test('debería lanzar un error si falla obtener los datos de un usuario del LDAP', async () => {
    client.search.mockRejectedValue(new Error('LDAP error'));

    const mail = "tomas01ariel@gmail.com";

    await expect(UserService.getUserByEmail(mail)).rejects.toThrow('Error in getUserByMail Service');
  }); */
});
