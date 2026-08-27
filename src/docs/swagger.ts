export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Vehicle Control API',
    version: '1.0.0',
    description: 'API RESTful para controle de utilização de automóveis por motoristas.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Automobiles', description: 'Automobile management' },
    { name: 'Drivers', description: 'Driver management' },
    { name: 'Usages', description: 'Vehicle usage management' },
  ],
  components: {
    schemas: {
      Automobile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          licensePlate: { type: 'string' },
          color: { type: 'string' },
          brand: { type: 'string' },
        },
      },
      Driver: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
        },
      },
      Usage: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time', nullable: true },
          driverId: { type: 'string', format: 'uuid' },
          automobileId: { type: 'string', format: 'uuid' },
          reason: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/automobiles': {
      get: {
        tags: ['Automobiles'],
        summary: 'List automobiles',
        parameters: [
          { in: 'query', name: 'color', schema: { type: 'string' } },
          { in: 'query', name: 'brand', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Successful response' },
        },
      },
      post: {
        tags: ['Automobiles'],
        summary: 'Create automobile',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  licensePlate: { type: 'string' },
                  color: { type: 'string' },
                  brand: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Validation Error' },
          '409': { description: 'Conflict' },
        },
      },
    },
    '/api/automobiles/{id}': {
      get: {
        tags: ['Automobiles'],
        summary: 'Get automobile by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Successful response' },
          '404': { description: 'Not Found' },
        },
      },
      put: {
        tags: ['Automobiles'],
        summary: 'Update automobile',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { color: { type: 'string' }, brand: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Successful response' },
          '404': { description: 'Not Found' },
        },
      },
      delete: {
        tags: ['Automobiles'],
        summary: 'Delete automobile',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'No Content' },
          '404': { description: 'Not Found' },
          '422': { description: 'Business Rule Error (Active Usage)' },
        },
      },
    },
    '/api/drivers': {
      get: {
        tags: ['Drivers'],
        summary: 'List drivers',
        parameters: [{ in: 'query', name: 'name', schema: { type: 'string' } }],
        responses: { '200': { description: 'Successful response' } },
      },
      post: {
        tags: ['Drivers'],
        summary: 'Create driver',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Validation Error' },
        },
      },
    },
    '/api/drivers/{id}': {
      get: {
        tags: ['Drivers'],
        summary: 'Get driver by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Successful response' },
          '404': { description: 'Not Found' },
        },
      },
      put: {
        tags: ['Drivers'],
        summary: 'Update driver',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' } } },
            },
          },
        },
        responses: {
          '200': { description: 'Successful response' },
          '404': { description: 'Not Found' },
        },
      },
      delete: {
        tags: ['Drivers'],
        summary: 'Delete driver',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'No Content' },
          '422': { description: 'Business Rule Error (Active Usage)' },
        },
      },
    },
    '/api/usages': {
      get: {
        tags: ['Usages'],
        summary: 'List usages (with details)',
        responses: { '200': { description: 'Successful response' } },
      },
      post: {
        tags: ['Usages'],
        summary: 'Start automobile usage',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  driverId: { type: 'string', format: 'uuid' },
                  automobileId: { type: 'string', format: 'uuid' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Created' },
          '422': { description: 'Business Rule Error' },
        },
      },
    },
    '/api/usages/{id}/finish': {
      patch: {
        tags: ['Usages'],
        summary: 'Finish usage',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Successful response' },
          '422': { description: 'Already finished' },
        },
      },
    },
  },
};
