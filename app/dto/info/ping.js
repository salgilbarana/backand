const HttpStatus = require('http-status-codes');
const { ErrorSchema, NotFoundSchema } = require('../common-schema');

const schema = {
  description: 'Ping API',
  tags: ['app', 'ping'],
  summary: 'Obtain response of the API',
  response: {
    [HttpStatus.OK]: {
      description: 'Successful response',
      type: 'string',
    },
    [HttpStatus.BAD_REQUEST]: NotFoundSchema,
    [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorSchema,
  },
};

module.exports = {
  schema,
};
