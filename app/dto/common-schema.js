const ErrorSchema = {
    description: 'Error response',
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      statusCode: { type: 'number' },
      data: { type: 'object' },
    },
  };
  
  const NotFoundSchema = {
    description: 'Not Found response',
    type: 'object',
    properties: {},
  };
  
  module.exports = {
    ErrorSchema,
    NotFoundSchema,
  };
  