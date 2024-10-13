const UserModel = require("../../models/Users");
const bcrypt = require("bcrypt");
const LdapClient = require("ldapjs-client");
const UserService = require("../../services/user.service");

jest.mock("../../models/Users"); // Mock del modelo de usuario
jest.mock("ldapjs-client"); // Mock del cliente LDAP

describe("UserService", () => {

  describe("getUsers", () => {


    it("should return a list of users", async () => {
      const mockUsers = [
        { name: "John", email: "john@example.com" },
        { name: "Jane", email: "jane@example.com" },
      ];

      UserModel.find.mockResolvedValue(mockUsers);

      const users = await UserService.getUsers();

      expect(users).toEqual(mockUsers);
      expect(UserModel.find).toHaveBeenCalled();
    });

    it("should throw an error if there is a problem fetching users", async () => {
      UserModel.find.mockRejectedValue(new Error("DB Error"));

      await expect(UserService.getUsers()).rejects.toThrow("Error in getUsers Service");
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const mockUser = { name: "John", email: "john@example.com" };

      UserModel.findOne.mockResolvedValue(mockUser);

      const user = await UserService.getUserById("123");

      expect(user).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({ _id: "123" });
    });

    it("should throw an error if there is a problem fetching user by ID", async () => {
      UserModel.findOne.mockRejectedValue(new Error("DB Error"));

      await expect(UserService.getUserById("123")).rejects.toThrow("Error in getUserById Service");
    });
  });

  describe("getUserByEmail", () => {
    it("should return a user by email", async () => {
      const mockUser = { name: "John", email: "john@example.com" };

      UserModel.findOne.mockResolvedValue(mockUser);

      const user = await UserService.getUserByEmail("john@example.com");

      expect(user).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    });

    it("should throw an error if there is a problem fetching user by email", async () => {
      UserModel.findOne.mockRejectedValue(new Error("DB Error"));

      await expect(UserService.getUserByEmail("john@example.com")).rejects.toThrow("Error in getUserById Service");
    });
  });

  /*
  describe("ldapGetUserByEmail", () => {
    it("should return user data from LDAP", async () => {
      const mockEntries = [{ cn: "John Doe", sn: "Doe", ou: "IT", telephoneNumber: "123456789" }];
      const mockSearch = jest.fn().mockResolvedValue(mockEntries);

      LdapClient.mockImplementation(() => ({
        search: mockSearch,
      }));

      const user = await UserService.ldapGetUserByEmail("john@example.com");

      expect(user).toEqual(mockEntries[0]);
      expect(mockSearch).toHaveBeenCalledWith("dc=your_dc", {
        filter: "(&(cn=john@example.com))",
        scope: "sub",
        attributes: ["sn", "cn", "ou", "telephoneNumber"],
      });
    });

    it("should throw an error if LDAP query fails", async () => {
      const mockSearch = jest.fn().mockRejectedValue(new Error("LDAP Error"));

      LdapClient.mockImplementation(() => ({
        search: mockSearch,
      }));

      await expect(UserService.ldapGetUserByEmail("john@example.com")).rejects.toThrow(
        "Error in ldapGetUserById Service"
      );
    });
  });

  */

  describe("createUser", () => {
    it("should create a new user if email is not registered", async () => {
      const mockUser = { name: "John", email: "john@example.com", password: "123456" };

      UserModel.findOne.mockResolvedValue(null); // No existe el usuario
      UserModel.create.mockResolvedValue(mockUser);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      const createdUser = await UserService.createUser(mockUser);

      expect(createdUser).toEqual({ ...mockUser, password: "hashedpassword" });
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(UserModel.create).toHaveBeenCalledWith({ ...mockUser, password: "hashedpassword" });
    });

    it("should throw an error if user is already registered", async () => {
      const mockUser = { name: "John", email: "john@example.com", password: "123456" };

      UserModel.findOne.mockResolvedValue(mockUser); // El usuario ya está registrado

      await expect(UserService.createUser(mockUser)).rejects.toThrow("User already registered");
    });

    it("should throw an error if there is an issue creating the user", async () => {
      UserModel.findOne.mockResolvedValue(null);
      UserModel.create.mockRejectedValue(new Error("DB Error"));

      const mockUser = { name: "John", email: "john@example.com", password: "123456" };

      await expect(UserService.createUser(mockUser)).rejects.toThrow("DB Error");
    });
  });

  
});
