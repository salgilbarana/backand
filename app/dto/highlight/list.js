const HttpStatus = require('http-status-codes');
const { ErrorSchema, NotFoundSchema } = require('../common-schema');

// request query
const requestQuerySchema = {
  type: 'object',
  properties: {
    user_idx: {
      type: 'number',
      description: 'user_idx',
    },
    page: {
      type: 'number',
      description: 'page number',
      minimum: 0,
    },
    page_size: {
      type: 'number',
      description: 'page size',
      minimum: 0,
    },
  },
};

const schema = {
  description: 'Get highlight list',
  tags: ['highlight'],
  summary: 'Get highlight',
  querystring: requestQuerySchema,
  response: {
    [HttpStatus.OK]: {
      description: 'Successful Response',
      type: 'array',
    },
    [HttpStatus.BAD_REQUEST]: NotFoundSchema,
    [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorSchema,
  },
};

class Dto {
}

module.exports = {
  schema,
  Dto,
};
