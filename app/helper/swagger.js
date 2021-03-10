const swagger = require('fastify-swagger');

const swaggerConfig = {
  routePrefix: '/docs/swagger',
  swagger: {
    info: {
      title: 'API',
      description: 'API\'s swagger doc',
      version: '1.0.0',
    },
    schemes: ['https', 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'auth', description: 'Auth related end-points' },
      { name: 'song', description: 'Song related end-points' },
    ],
  },
  exposeRoute: true,
};

module.exports = {
  swagger,
  swaggerConfig,
};
