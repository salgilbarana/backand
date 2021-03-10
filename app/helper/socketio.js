const socketIO = require('socket.io');
const ioRedis = require('socket.io-redis');

async function register(fastify) {
  const { redis, server } = fastify;

  const io = socketIO(server, { path: '/socket.io' });
  const pipeline = redis.chat.pipeline();

  io.adapter(ioRedis({ host: 'chat-redis.nhsco.xyz', port: 7339 }));
  io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
      socket.join(data.roomName);
      socket.emit('joinRoomDone', { nickName: data.nickName, roomName: data.roomName });
    });

    socket.on('message', (data) => {
      io.sockets.to(data.roomname).emit('message', { msg: data.msg, nickname: data.nickname, type: data.type });
      const json = JSON.stringify({
        nickname: `${data.nickname}`, time: `${new Date().getTime()}`, message: `${data.msg}`, type: `${data.type}`,
      });
      pipeline.zadd(`${data.roomname}`, `${new Date().getTime()}`, json)
        .zremrangebyscore(`${data.roomname}`, 0, `(${new Date().getTime() - 2592000}`) //save to about 30day
        .exec((err, val) => {
          console.log(err || val);
        });
    });
  });
}

module.exports = {
  register,
};
