// 수정 필요
const HttpStatus = require('http-status-codes');
const { ErrorSchema, NotFoundSchema } = require('../common-schema');

// request body
const requestBodySchema = {
  type: 'object',
  required: [
    'user_idx',
    'history_idx',
    'file_idx',
  ],
  properties: {
    user_idx: {
      type: 'number',
      description: 'user idx',
    },
    history_idx: {
      type: 'number',
      description: 'history idx',
    },
    file_idx: {
      type: 'number',
      description: 'file idx',
    },
    name: {
      type: 'string',
      description: 'title for highlight',
    },
    description: {
      type: 'string',
      description: 'explain for highlight',
    },
  },
};

// response dto
const responeSchema = {
  description: 'Successful Response',
  type: 'object',
  properties: {
    idx: { type: 'number' },
    history_idx: { type: 'number' },
    user_idx: { type: 'number' },
    file_idx: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
  },
};

const schema = {
  description: 'Coaching Recoard Upload',
  tags: ['Highlight'],
  summary: 'Highlight',
  body: requestBodySchema,
  response: {
    [HttpStatus.OK]: responeSchema,
    [HttpStatus.BAD_REQUEST]: NotFoundSchema,
    [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorSchema,
  },
};

module.exports = {
  schema,
};
