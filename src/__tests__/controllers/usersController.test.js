/*

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock de los servicios utilizados en LoginController
jest.mock('../../services/auth.service');
jest.mock('../../services/user.service');

const AuthService = require('../../services/auth.service');
const UserService = require('../../services/user.service');
const LoginController = require('../../controllers/login.controller'); 

const app = express();
app.use(express.json()); // Para parsear el cuerpo de las solicitudes
app.post('/login', (req, res) => LoginController.login(req, res));

const { SECRET_KEY_JWT } = process.env;

describe('LoginController', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  it('should return 200 and a token when login is successful', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Mock de la validación de credenciales
    AuthService.ldapValidCredentials.mockResolvedValue({ status: 0 });
    
    // Mock de la obtención del usuario
    const mockUser = { email, name: 'Test User', role: 'admin' };
    UserService.ldapGetUserByEmail.mockResolvedValue(mockUser);
    
    // Mock del token JWT
    const token = jwt.sign(mockUser, SECRET_KEY_JWT, { expiresIn: '1d' });
    
    const res = await request(app)
      .post('/login')
      .send({ email, password });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token).toBe(token);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(email);
  });

  
  it('should return 401 when login fails', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    
    // Mock de credenciales inválidas
    AuthService.ldapValidCredentials.mockResolvedValue({ status: 1 });
    
    const res = await request(app)
      .post('/login')
      .send({ email, password });
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized.');
  });

  
  it('should return 500 when there is a server error', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Mock de un error inesperado
    AuthService.ldapValidCredentials.mockRejectedValue(new Error('Something went wrong'));
    
    const res = await request(app)
      .post('/login')
      .send({ email, password });
    
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Something went wrong');
  });

  
});


*/