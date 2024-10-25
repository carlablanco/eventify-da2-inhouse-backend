// Logs.test.js
const mongoose = require("mongoose");
const Logs = require("../../models/Logs");
const { logTypes } = require("../../config/logs");
const { roleTypes } = require("../../config/roles");

// Habilito o deshabilito los console.error para mostrarse en la consola durante el test.
const SHOW_CONSOLE_LOGS = false;
const SHOW_CONSOLE_ERRORS = false;

// Mock de fetch para simular la respuesta del servidor Python
global.fetch = jest.fn();

describe("Logs Model", () => {
    beforeEach(() => {
        fetch.mockClear();

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

    test("debería validar los campos del schema", () => {
        const log = new Logs({
            username: "testUser",
            action: logTypes.LOGIN,
            isSuspicious: false,
        });

        const error = log.validateSync();
        expect(error).toBeUndefined(); // No debería haber errores de validación con todos los campos requeridos
    });

    test("debería tirar errores ante falta de campos en el schema", () => {
        const log = new Logs({
            username: "testUser",
            isSuspicious: false,
        });

        const error = log.validateSync();
        expect(error.errors.action).toBeDefined();
    });

    test("debería llamar al modelo y insertar los datos de forma correcta", async () => {
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ mensaje: "1" }),
        });

        const uid = "user_id";
        const username = "testUser";
        const modules = { analitica: ["admin", "artista"] };
        const action = logTypes.LOGIN;

        // Mock de `insertMany` en el modelo `Logs`
        Logs.insertMany = jest.fn();

        await Logs.registerLog(uid, username, modules, action);

        // Verifica si fetch fue llamado con los argumentos correctos
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("inferir"), expect.any(Object));

        expect(Logs.insertMany).toHaveBeenCalledWith(
            {
                username: "testUser",
                modules,
                action: logTypes.LOGIN,
                isSuspicious: true,
            }
        );
    });

    test("debería llamar al modelo y insertar los datos de forma correcta con módulo y rol", async () => {
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ mensaje: "1" }),
        });

        const uid = "user_id";
        const username = "testUser";
        const modules = { analitica: ["admin", "artista"] };
        const action = logTypes.LOGIN;
        const module = "analitica";
        const role = "admin";

        // Mock de `insertMany` en el modelo `Logs`
        Logs.insertMany = jest.fn();

        await Logs.registerLog(uid, username, modules, action, module, role);

        // Verifica si fetch fue llamado con los argumentos correctos
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("inferir"), expect.any(Object));

        expect(Logs.insertMany).toHaveBeenCalledWith(
            {
                username: "testUser",
                modules,
                action: logTypes.LOGIN,
                isSuspicious: true,
                module,
                role
            }
        );
    });

    test("debería arrojar error por falta de action realizada por el usuario", async () => {
        const uid = "user_id";
        const username = "testUser";
        const modules = { analitica: ["admin", "artista"] };
        const action = "";

        await expect(Logs.registerLog(uid, username, modules, action)).rejects.toThrow("Log action described is invalid.");
    });

    test("debería marcar la acción como sospechosa si falla el fetch", async () => {
        fetch.mockRejectedValue(new Error("Network error"));

        const uid = "user_id";
        const username = "testUser";
        const modules = { analitica: ["admin", "artista"] };
        const action = logTypes.LOGIN;

        await expect(Logs.registerLog(uid, username, modules, action)).rejects.toThrow("Error in registerLog LogsSchema method");

        expect(mongoose.model("Logs").insertMany).toHaveBeenCalledWith(
            {
                username: "testUser",
                modules,
                action: logTypes.LOGIN,
                isSuspicious: true, // Debería ser marcado como sospechoso
            }
        );
    });
});
