const LogsModel = require("../../models/Logs");
const LogsService = require("../../services/logs.service");

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

jest.mock("../../models/Logs"); // Mock del modelo de logs

describe("UserService", () => {

  beforeEach(() => {
    mockLogs = [
      { id: 1, username: "test@gmail.com" },
      { id: 2, username: "test@gmail.com" },
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

  test('debería devolver todos los logs', async () => {
    LogsModel.find.mockResolvedValue(mockLogs); // Mockeamos la respuesta de find

    const result = await LogsService.getLogs();

    expect(LogsModel.find).toHaveBeenCalled(); // Verifica que se llamó
    expect(result).toEqual(mockLogs); // Verifica que el resultado coincide con los logs simulados
  });

  test('debería devolver todos los logs de un usuario', async () => {
    LogsModel.find.mockResolvedValue(mockLogs); // Mockeamos la respuesta de find

    const result = await LogsService.getLogs("test@gmail.com");

    expect(LogsModel.find).toHaveBeenCalledWith({ username: "test@gmail.com" }); // Verifica que se llamó con el filtro correcto
    expect(result).toEqual(mockLogs); // Verifica que el resultado coincide con los logs simulados
  });

  test('simula un error de la base de datos', async () => {
    LogsModel.find.mockRejectedValue(new Error("Internal server error")); // Mockeamos la respuesta de find

    await expect(LogsService.getLogs()).rejects.toThrow("Error in getLogs Service");

    expect(LogsModel.find).toHaveBeenCalled(); // Verifica que se llamó
  });
});
