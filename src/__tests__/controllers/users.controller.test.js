process.env.SECRET_KEY_JWT = 'test_secret_key';
process.env.LDAP_IP = 'ldap://test_ldap_ip';
process.env.LDAP_OU = 'test_ou';
process.env.LDAP_DC = 'test_dc';

const UserController = require('../../controllers/users.controller');
const UserService = require('../../services/user.service');

jest.mock('../../services/user.service'); // Mock del UserService

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
        id: '1'
      }
    };

    // Configuramos un objeto de respuesta simulado
    res = {
      status: jest.fn().mockReturnThis(), // Permite encadenar métodos
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
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

  test('debería devolver un usuario por ID', async () => {
    // Mockeamos la respuesta de getUserById
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    UserService.getUserById.mockResolvedValue(mockUser);

    // Llamamos al método getUserById
    await UserController.getUserById(req, res);

    // Expectativas
    expect(UserService.getUserById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('debería devolver 404 si el usuario no se encuentra', async () => {
    // Mockeamos la respuesta de getUserById para que retorne null
    UserService.getUserById.mockResolvedValue(null);

    // Llamamos al método getUserById
    await UserController.getUserById(req, res);

    // Expectativas
    expect(UserService.getUserById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      method: "getUserById",
      message: "Not Found",
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
