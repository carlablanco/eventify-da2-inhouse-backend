process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

const UserController = require('../../controllers/users.controller');
const UserService = require('../../services/user.service');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_ERRORS = false;

jest.mock('../../services/user.service'); // Mock del UserService

describe('UserController Singleton', () => {
  test('debería retornar siempre la misma instancia', () => {
    //Revisar, me indica que la línea return no la puede verificar.
    const instance1 = UserController;
    const instance2 = require('../../controllers/users.controller');

    expect(instance1).toBe(instance2); // Verifica que sea la misma instancia
  });
});

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    // Configuramos un objeto de solicitud simulado
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      },
      params: {
        id: '1',
        mail: 'test@example.com',
        module: 'test'
      }
    };

    // Configuramos un objeto de respuesta simulado
    res = {
      status: jest.fn().mockReturnThis(), // Permite encadenar métodos
      json: jest.fn()
    };

    if (!SHOW_CONSOLE_ERRORS)
      // Silencia console.error
      jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test

    if (!SHOW_CONSOLE_ERRORS)
      // Restaura console.error
      console.error.mockRestore();
  });

  test('debería devolver todos los usuarios', async () => {
    // Mockeamos la respuesta de getUsers
    const mockUsers = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
    UserService.getUsers.mockResolvedValue(mockUsers);

    // Llamamos al método getUsers
    await UserController.getUsers(req, res);

    // Expectativas
    expect(UserService.getUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('debería devolver 500 si falló getUsers', async () => {
    // Mockeamos para que lance un error
    UserService.getUsers.mockRejectedValue(new Error('Error al obtener los usuarios'));

    // Llamamos al método getUsers
    await UserController.getUsers(req, res);

    // Expectativas
    expect(UserService.getUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: "getUsers",
      message: "Error al obtener los usuarios",
    });
  });

  test('debería devolver un usuario por Email', async () => {
    // Mockeamos la respuesta de getUserByEmail
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    UserService.getUserByEmail.mockResolvedValue(mockUser);

    // Llamamos al método getUserByMail
    await UserController.getUserByMail(req, res);

    // Expectativas
    expect(UserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('debería devolver 404 si el usuario no se encuentra', async () => {
    // Mockeamos la respuesta de getUserByEmail para que retorne null
    UserService.getUserByEmail.mockResolvedValue(null);

    // Llamamos al método getUserByMail
    await UserController.getUserByMail(req, res);

    // Expectativas
    expect(UserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      method: "getUserByMail",
      message: "Not Found",
    });
  });

  test('debería devolver 500 si falló getUserByEmail', async () => {
    // Mockeamos para que lance un error
    UserService.getUserByEmail.mockRejectedValue(new Error('Error al obtener el usuario'));

    // Llamamos al método getUsers
    await UserController.getUserByMail(req, res);

    // Expectativas
    expect(UserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: "getUserByMail",
      message: "Error al obtener el usuario",
    });
  });

  test('debería devolver los usuarios de un módulo en particular', async () => {
    // Mockeamos la respuesta de getUsersByModule
    const mockUsers = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
    UserService.getUsersByModule.mockResolvedValue(mockUsers);

    // Llamamos al método getUsersByModule
    await UserController.getUsersByModule(req, res);

    // Expectativas
    expect(UserService.getUsersByModule).toHaveBeenCalledWith('test');
    expect(UserService.getUsersByRole).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('debería devolver los usuarios de un módulo y rol en particular', async () => {
    // Mockeamos la respuesta de getUsersByRole
    const mockUsers = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
    UserService.getUsersByRole.mockResolvedValue(mockUsers);

    req.query = { role: "rol" };

    // Llamamos al método getUsersByModule
    await UserController.getUsersByModule(req, res);

    // Expectativas
    expect(UserService.getUsersByModule).not.toHaveBeenCalled();
    expect(UserService.getUsersByRole).toHaveBeenCalledWith('rol', 'test');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('debería devolver 404 si no se encuentran usuarios en ese módulo', async () => {
    // Mockeamos la respuesta de getUsersByModule para que retorne vector vacío.
    UserService.getUsersByModule.mockResolvedValue([]);

    // Llamamos al método getUsersByModule
    await UserController.getUsersByModule(req, res);

    // Expectativas
    expect(UserService.getUsersByModule).toHaveBeenCalledWith('test');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      method: "getUsersByModule",
      message: "Not Found",
    });
  });

  test('debería devolver 500 si falló getUsersByModule', async () => {
    // Mockeamos para que lance un error
    UserService.getUsersByModule.mockRejectedValue(new Error('Error al obtener los usuarios'));

    // Llamamos al método getUsers
    await UserController.getUsersByModule(req, res);

    // Expectativas
    expect(UserService.getUsersByModule).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: "getUsersByModule",
      message: "Error al obtener los usuarios",
    });
  });

  test('debería crear un nuevo usuario', async () => {
    // Mockeamos la respuesta de createUser
    const newUser = { email: 'new@example.com', name: 'New User' };
    UserService.createUser.mockResolvedValue(newUser);

    // Llamamos al método createUser
    await UserController.createUser(req, res);

    // Expectativas
    expect(UserService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Created!",
      user: newUser,
    });
  });

  test('debería devolver 500 si hay un error al crear un usuario', async () => {
    // Mockeamos para que lance un error
    UserService.createUser.mockRejectedValue(new Error('Error al crear el usuario'));

    // Llamamos al método createUser
    await UserController.createUser(req, res);

    // Expectativas
    expect(UserService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      method: "createUser",
      message: 'Error al crear el usuario',
    });
  });
});
