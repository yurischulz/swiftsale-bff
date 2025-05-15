import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Mock global para evitar interações reais com o banco de dados
jest.mock('mongoose');

// Configuração global para evitar warnings de timers
jest.useFakeTimers();

// Configuração de logs para evitar poluição no console durante os testes
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
