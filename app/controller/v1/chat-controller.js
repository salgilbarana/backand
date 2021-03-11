/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const HttpStatus = require('http-status-codes/index');
const ChatService = require('../../service/chat-service');

const upFile = async (req, res) => {
  const { files } = req;
  const hostName = req.hostname;

  const fileUrl = await ChatService.upFile(files, hostName);

  res.code(HttpStatus.OK).send(fileUrl);
};

const getRooms = async (req, res) => {
  const data = [];
  const reqParams = req.params;
  // get only chat room with other user
  const result = await ChatService.getRooms({ user_idx: reqParams.userIdx, is_exit: false }, ['user_idx', 'room_idx']);
  
  for (const f of result) {
    const roomNuser = await ChatService.getRoomNuser(f.room_idx, f.user_idx);

    if (!roomNuser || !roomNuser.room) continue;
    
    // get first chat in recent message
    const lastMsg = await req.chat.zrevrange(`${roomNuser.room.room}`, 0, 0);
    if (lastMsg.length) {
      roomNuser.dataValues.message = JSON.parse(lastMsg[0]);
    }

    data.push(
      roomNuser,
    );
  }
  res.code(HttpStatus.OK).send(data);
};

// get 1000 massege
const getMsg = async (req, res) => {
  const reqParams = req.params;
  const msg = await req.chat.zrange(`${reqParams.room}`, 0, 99);
  // change to json format
  const obj = msg.reduce((acc, cur, i) => {
    acc[i] = JSON.parse(cur);
    return acc;
  }, {});

  res.code(HttpStatus.OK).send(Object.values(obj));
};

// leave to chat room
const exitUser = async (req, res) => {
  const reqParams = req.params;

  const roomIdx = await ChatService.getRoom({ room: reqParams.room }, ['idx']);
  const data = await ChatService.updateExitUser(roomIdx.idx, req.body);

  res.code(HttpStatus.OK).send(data);
};

// remove chat room
const deleteRoom = async (req, res) => {
  const reqParams = req.params;

  const data = await ChatService.deleteRoom(reqParams);

  res.code(HttpStatus.OK).send(data);
};

module.exports = {
  upFile,
  getRooms,
  getMsg,
  exitUser,
  deleteRoom,
};
