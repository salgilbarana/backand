// 수정 필요
const HttpStatus = require('http-status-codes');
const { ErrorSchema, NotFoundSchema } = require('../common-schema');

// request body
const requestBodySchema = {
  // type: 'object',
  required: [
    'audio',
    'user_idx',
    'score_idx',
    'history_idx',
  ],
  properties: {
    audio: {
      // type: 'string',
      isFileType: true,
      description: 'audio file',
    },
    user_idx: {
      type: 'number',
      description: 'user idx',
    },
    score_idx: {
      type: 'number',
      description: 'score idx',
    },
    history_idx: {
      type: 'number',
      description: 'history idx',
    },
    name: {
      type: 'string',
      description: 'record name',
    },
    description: {
      type: 'string',
      description: 'explain for record',
    },
  },
};

// response dto
const responeSchema = {
  description: 'Successful Response',
  type: 'object',
  properties: {
    idx: { type: 'number' },
    score_idx: { type: 'number' },
    history_idx: { type: 'number' },
    user_idx: { type: 'number' },
    file_idx: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
  },
};

const schema = {
  description: 'Record Upload',
  consumes: ['multipart/form-data'],
  tags: ['record'],
  summary: 'record',
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
