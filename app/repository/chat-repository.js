const {
  Op, col,
} = require('sequelize');
const Repository = require('./repository');
const { DBClient } = require('../helper/db');

class ChatRepository extends Repository {
  async duplicateRoom(host, member) {
    const whereClauses = {
      user_idx: host,
    };
    return this.model.findAll({

      include: [
        {
          model: this.model,
          required: true,
          attributes: ['user_idx'],
          as: 'parent',
          where: {
            user_idx: member,
          },
        },
      ],
      where: whereClauses,
    });
  }

  async getRoomNuser(roomIdx, userIdx) {
    const whereClauses = {
      room_idx: roomIdx,
    };
    return this.model.findOne({
      include: [
        {
          model: DBClient().room,
          required: true,
          attributes: ['idx', 'room', 'highlight_idx'],
          where: { idx: roomIdx },
        },
        {
          model: DBClient().user,
          required: true,
          attributes: ['idx', 'profile_image', 'nickname'],
          where: { idx: { [Op.ne]: userIdx } },
        },
      ],
      attributes: ['idx', 'is_exit'],
      where: whereClauses,
    });
  }

  async userNroom(nickname, room) {
    return this.model.findAll({
      include: [
        {
          model: DBClient().room,
          required: true,
          attributes: ['room'],
          where: { room },
        },
        {
          model: DBClient().user,
          required: true,
          attributes: ['nickname'],
          where: { nickname },
        },
      ],
    });
  }

  async deleteMember(userIdx, roomIdx) {
    const whereClauses = {
      [Op.and]: [
        { user_idx: userIdx },
        { room_idx: roomIdx },
      ],
    };
    return this.model.destroy({
      where: whereClauses,
    });
  }

  async updateJoinRoom(clause, params) {
    const whereClauses = {
      [Op.and]: [
        { user_idx: params.user_idx },
        { room_idx: params.room_idx },
      ],
    };
    return this.model.update(
      clause, { where: whereClauses },
    );
  }
}
module.exports = ChatRepository;
