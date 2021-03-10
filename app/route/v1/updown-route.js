const Controller = require('../../controller/v1/updown-controller');
const {cpUpload} = require('../../helper/multer');

module.exports = () => [
  {
    method: 'POST',
    url: '/upload',
    preHandler: cpUpload,
    handler: Controller.addFile,
  },
  {
    method: 'GET',
    url: '/download/:file_idx',
    handler: Controller.getFile,
  },
];
