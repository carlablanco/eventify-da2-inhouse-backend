const mongoose = require('mongoose');
const connectDB = require('../../database/mongoConnect'); 

// Usamos jest.mock para mockear mongoose.connect
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  it('should connect to MongoDB successfully', async () => {
    // Mock de una conexión exitosa
    mongoose.connect.mockResolvedValueOnce(true);

    console.log = jest.fn();

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Conexión exitosa a MongoDB usando Mongoose!');
  });

  it('should handle connection errors', async () => {
    // Mock de un error en la conexión
    const mockError = new Error('Error de conexión');
    mongoose.connect.mockRejectedValueOnce(mockError);

    console.error = jest.fn();
    process.exit = jest.fn();

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('Error conectando a MongoDB: ', mockError);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
