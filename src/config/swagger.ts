import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'SwiftSale Routes API',
      version: '1.0.0',
      description: 'API para gerenciar rotas do projeto swiftsale-bff',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: [__dirname + '/../routes/*.ts'], // Caminho para os arquivos de rotas
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
