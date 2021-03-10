const HttpStatus = require('http-status-codes');
const { ErrorSchema, NotFoundSchema } = require('../common-schema');

const schema = {
  description: 'Health for DB',
  tags: ['app', 'health'],
  summary: 'Obtain health for DB',
  response: {
    [HttpStatus.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        status: { type: 'string' },
        mysql: { type: 'string' },
      },
      [HttpStatus.BAD_REQUEST]: NotFoundSchema,
      [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorSchema,
    },
  },
};

module.exports = {
  schema,
};
