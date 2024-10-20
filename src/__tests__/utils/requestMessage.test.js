const requestMessages = require('../../utils/requestMessages');

describe('requestMessages', () => {
  test('debería tener los códigos de estado y mensajes correctos', () => {
    const mensajesEsperados = {
      0: { statusHttp: 200, message: "Success" },
      1: { statusHttp: 201, message: "Successfully Created" },
      3: { statusHttp: 404, message: "Ocurrió un error al buscar el mail del usuario" },
      4: { statusHttp: 409, message: "Email existente" },
      5: { statusHttp: 500, message: "Error ocurrido durante la creación del usuario" },
      6: { statusHttp: 400, message: "Campos incompletos o datos inválidos" },
      7: { statusHttp: 401, message: "Error en la contraseña" },
      8: { statusHttp: 500, message: "Usuario o password no informados" },
      9: { statusHttp: 500, message: "Error ocurrido durante el paginado" },
      10: { statusHttp: 400, message: "ID de usuario requerido" },
      11: { statusHttp: 500, message: "Error ocurrido durante la búsqueda del usuario" },
      12: { statusHttp: 400, message: "Formato de email incorrecto" },
      13: { statusHttp: 500, message: "Error al conectarse con la base de datos" },
    };

    Object.keys(mensajesEsperados).forEach(key => {
      expect(requestMessages[key]).toEqual(mensajesEsperados[key]);
    });
  });

  test('debería tener el número correcto de mensajes', () => {
    expect(Object.keys(requestMessages).length).toBe(13);
  });

  test('debería devolver un statusHttp válido', () => {
    Object.values(requestMessages).forEach(({ statusHttp }) => {
      expect(typeof statusHttp).toBe('number');
      expect(statusHttp).toBeGreaterThan(0);
    });
  });

  test('debería devolver un mensaje válido', () => {
    Object.values(requestMessages).forEach(({ message }) => {
      expect(typeof message).toBe('string');
      expect(message).not.toBe('');
    });
  });
});
