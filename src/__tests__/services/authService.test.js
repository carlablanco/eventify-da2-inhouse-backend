const bcrypt = require("bcrypt");
const UserModel = require("../../models/Users");
const AuthService = require("../../services/auth.service");
const { client } = require('../../utils/ldapConnect');

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock("../../models/Users"); // Mock del modelo de usuario

jest.mock('../../utils/ldapConnect', () => ({
  client: {
    bind: jest.fn(),
  },
}));

describe("AuthService", () => {

  beforeEach(() => {
    email = 'test@example.com';
    password = '1234';

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

  describe("ldapValidCredentials", () => {
    it("should return a successful login for valid LDAP credentials", async () => {
      const bindResult = { status: 0 };
      client.bind.mockResolvedValue(bindResult);

      const result = await AuthService.ldapValidCredentials(email, password);

      expect(result).toHaveProperty('status', 0);
    });


    it("debería devolver error en la conexión con el LDAP", async () => {
      client.bind.mockRejectedValue(new Error('LDAP error'));

      await expect(AuthService.ldapValidCredentials(email, password)).rejects.toThrow("Error with LDAP credentials validation");
    });

  });



});
