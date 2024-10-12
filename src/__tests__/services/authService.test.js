const bcrypt = require("bcrypt");
const UserModel = require("../../models/Users");
const AuthService = require("../../services/auth.service");
const LdapClient = require("ldapjs-client");

jest.mock("../../models/Users"); // Mock del modelo de usuario
jest.mock("ldapjs-client"); // Mock del cliente LDAP

describe("AuthService", () => {

  describe("hasValidCredentials", () => {


    it("should return true if email and password match", async () => {
      const mockUser = {
        email: "john@example.com",
        password: bcrypt.hashSync("123456", 10),
      };
      
      // Simula que el modelo retorna un usuario
      UserModel.findOne.mockResolvedValue(mockUser);
      
      const isValid = await AuthService.hasValidCredentials(
        "john@example.com",
        "123456"
      );
      
      expect(isValid).toBe(true);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    });

    /*

    it("should return false if email does not exist", async () => {
      // Simula que no se encuentra el usuario
      UserModel.findOne.mockResolvedValue(null);

      const isValid = await AuthService.hasValidCredentials(
        "john@example.com",
        "123456"
      );

      expect(isValid).toBe(null);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    });

    */

    it("should return false if password does not match", async () => {
      const mockUser = {
        email: "john@example.com",
        password: bcrypt.hashSync("abcdef", 10),
      };

      UserModel.findOne.mockResolvedValue(mockUser);

      const isValid = await AuthService.hasValidCredentials(
        "john@example.com",
        "123456"
      );

      expect(isValid).toBe(false);
    });


  
    it("should throw an error if there is a problem during validation", async () => {
      // Simula un error en la búsqueda de usuario
      UserModel.findOne.mockRejectedValue(new Error("DB error"));

      await expect(
        AuthService.hasValidCredentials("john@example.com", "123456")
      ).rejects.toThrow("Error in credentials validation");
    });


  });

/*
  describe("ldapValidCredentials", () => {

  
    it("should return a successful login for valid LDAP credentials", async () => {
      const mockBind = jest.fn().mockResolvedValue(true); // Simula que el bind en LDAP es exitoso
      LdapClient.mockImplementation(() => ({
        bind: mockBind,
      }));

      const isValid = await AuthService.ldapValidCredentials("john@example.com", "password123");

      expect(isValid).toBe(true);
      expect(mockBind).toHaveBeenCalledWith("cn=john@example.com,ou=your_ou,dc=your_dc", "password123");
    });

        
    it("should throw an error if LDAP credentials are invalid", async () => {
      const mockBind = jest.fn().mockRejectedValue(new Error("LDAP error"));
      LdapClient.mockImplementation(() => ({
        bind: mockBind,
      }));

      await expect(
        AuthService.ldapValidCredentials("invalid@example.com", "wrongpassword")
      ).rejects.toThrow("Error with LDAP credentials validation");

      expect(mockBind).toHaveBeenCalledWith("cn=invalid@example.com,ou=your_ou,dc=your_dc", "wrongpassword");
    });

  });

  */

});
