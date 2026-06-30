import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'Documentación de la API de TaskFlow',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || '3000'}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserDto: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', description: 'Nombre completo del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico único' },
            password: { type: 'string', format: 'password', description: 'Contraseña (mín 8 caracteres)' },
          },
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre completo del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico único' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
