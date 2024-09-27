const { getUserById } = require("../controllers/user.controller");
const UserService = require("../services/user.service");
const diccionarioMensajes = require("../utils/requestMessages");

jest.mock("../services/user.service"); // Mockeamos UserService

describe("getUserById", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if no id is provided", async () => {
    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(diccionarioMensajes[10].statusHttp);
    expect(res.json).toHaveBeenCalledWith({
      status: diccionarioMensajes[10].statusHttp,
      message: diccionarioMensajes[10].message,
    });
  });

  it("should return user data if id is provided", async () => {
    req.query.id = "1";
    const mockUser = { id: "1", name: "John Doe" }; // Mock de usuario

    UserService.getUserById.mockResolvedValue(mockUser); // Mockeamos el retorno

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(diccionarioMensajes[0].statusHttp);
    expect(res.json).toHaveBeenCalledWith({
      status: diccionarioMensajes[0].statusHttp,
      data: mockUser,
      message: diccionarioMensajes[0].message,
    });
  });

  it("should handle errors", async () => {
    req.query.id = "1";
    const mockError = { statusHttp: 500, message: "Internal Server Error" };

    UserService.getUserById.mockRejectedValue(mockError); // Simulamos un error

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(mockError.statusHttp);
    expect(res.json).toHaveBeenCalledWith({
      status: mockError.statusHttp,
      message: mockError.message,
    });
  });
});
