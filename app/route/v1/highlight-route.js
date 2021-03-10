const Controller = require('../../controller/v1/highlight-controller');
const { cpUpload } = require('../../helper/multer');

module.exports = (fastify) => [
  {
    // create highlight
    method: 'POST',
    url: '/highlights',
    schema: null,
    preHandler: cpUpload,
    handler: Controller.addHighLight,
  },
  {
    // create feedback for highlight 
    method: 'POST',
    url: '/highlights/feedback',
    schema: null,
    preHandler: cpUpload,
    handler: Controller.addFeedback,
  },
  {
    // create review for highlight
    method: 'POST',
    url: '/highlights/review',
    schema: null,
    handler: Controller.addReview,
  },
  {
    // get all of user's highlight
    method: 'GET',
    schema: null,
    url: '/highlights/:user_idx',

    handler: Controller.getHighLight,
  },
  {
    // get feedback for highlight
    method: 'GET',
    url: '/highlights/:idx/feedback',
    schema: null,
    handler: Controller.getFeedback,
  },
  {
    // get highlight randomly
    method: 'GET',
    url: '/highlights/:user_idx/random',
    schema: null,
    handler: Controller.getRandom,
  },
  {
    // update review for highlight
    method: 'PATCH',
    url: '/highlights/:idx/review',
    schema: null,
    handler: Controller.updateReview,
  },
  {
    // delete review for highlight
    method: 'DELETE',
    url: '/highlights/:idx/review',
    schema: null,
    handler: Controller.deleteReview,
  },
  {
    // update highlight 
    method: 'PATCH',
    url: '/highlights/:idx',
    schema: null,
    handler: Controller.updateHighLights,
  },
  {
    // delete highlight
    method: 'DELETE',
    url: '/highlights/:idx',
    schema: null,
    handler: Controller.deleteHighLight,
  },
];
