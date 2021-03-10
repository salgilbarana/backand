/* eslint-disable no-unused-vars */
const Controller = require('../../controller/v1/chat-controller');
const { cpUpload } = require('../../helper/multer')

module.exports = (fastify) => [
  // upload file in room of chat
  {
    method: 'POST',
    url: '/chatrooms/upload',
    preHandler: cpUpload,
    handler: Controller.upFile,
  },
  // look up urser's room of chat
  {
    method: 'GET',
    url: '/chatrooms/:userIdx',
    schema: null,
    handler: Controller.getRooms,
  },
  // look up user's massage of chat
  {
    method: 'GET',
    url: '/chats/:room',
    schema: null,
    handler: Controller.getMsg,
  },
   // delete only user in room of chat
   {
    method: 'PATCH',
    url: '/chatrooms/:room/users',
    schema: null,
    handler: Controller.exitUser,
  },
  //  delete room of chat
  {
    method: 'DELETE',
    url: '/chatrooms/:room',
    schema: null,
    handler: Controller.deleteRoom,
  },
];
