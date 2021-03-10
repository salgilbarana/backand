const HttpStatus = require('http-status-codes/index');
const ifaces = require('os').networkInterfaces();
const { DBClient } = require('../helper/db');

const ChatRepoImpl = require('../repository/chat-repository');
const UserRepoImpl = require('../repository/user-repository');
const FileRepoImpl = require('../repository/file-repository');

const RoomRepository = new ChatRepoImpl(DBClient().room);
const UserRepository = new UserRepoImpl(DBClient().user);
const JoinRoomRepository = new ChatRepoImpl(DBClient().join_room);
const FileRepository = new FileRepoImpl(DBClient().file);

async function upFile(files, hostName) {
  let ip;
  let file = {};
  let fileUrl = null;

  // local ip address
  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].filter((details) => {
      if (details.family === 'IPv4' && details.internal === false) {
        ip = details.address;
      }
      return ip;
    });
  });

  // insert row for file information
  if (Object.keys(files).length !== 0) {
    const filePath = files.audio[0].path;
    file = await FileRepository.createOne({ path: filePath, ip });
    fileUrl = `https://${hostName}/v1/download/${file.idx}`;
  }
  return fileUrl;
}

async function duplicateRoom(body) {
  const { host } = body;
  const { member } = body;
  const roomList = await JoinRoomRepository.duplicateRoom(host, member);

  return roomList;
}

async function createRoom(body) {
  const newRoom = await RoomRepository.createOne({
    room: body.room,
    max: 2,
    highlight_idx: body.highlight_idx,
    feedback_highlight_idx: body.feedback_highlight_idx,
  });

  await JoinRoomRepository.createOne({
    user_idx: body.host,
    room_idx: newRoom.idx,
  });
  await JoinRoomRepository.createOne({
    user_idx: body.member,
    room_idx: newRoom.idx,
  });
  return newRoom;
}

async function getRoom(where, attributes) {
  const data = await RoomRepository.findOne({
    where,
    attributes,
  });

  return data;
}

async function getRooms(where, attributes) {
  const data = await JoinRoomRepository.findAll({
    where,
    attributes,
  });

  return data;
}

async function getRoomNuser(roomIdx, userIdx) {
  const data = await JoinRoomRepository.getRoomNuser(roomIdx, userIdx);
  return data;
}

async function getUser(where, attributes) {
  const userInfo = await UserRepository.findOne({
    where,
    attributes,
  });
  return userInfo;
}

async function updateExitUser(roomIdx, params = {}) {
  const result = await JoinRoomRepository.updateJoinRoom({ is_exit: true }, {
    room_idx: roomIdx,
    user_idx: params.userIdx,
  });

  return result;
}

async function deleteRoom(params) {
  const data = await RoomRepository.deleteOne({
    where: {
      room: params.room,
    },
  });
  return data;
}

async function userNroom(nickname, room) {
  const data = await JoinRoomRepository.userNroom(
    nickname, room,
  );
  return data;
}
module.exports = {
  upFile,
  createRoom,
  getRoom,
  getRooms,
  getRoomNuser,
  getUser,
  duplicateRoom,
  updateExitUser,
  deleteRoom,
  userNroom,
};
