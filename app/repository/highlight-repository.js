const {
  Op, fn, col, where, literal,
} = require('sequelize');

const Repository = require('./repository');

const { DBClient } = require('../helper/db');

class HighlightRepository extends Repository {
  async findExceptIdx(params, num) {
    const whereClauses = {
      user_idx: { [Op.ne]: params.user_idx },
      count: { [Op.gt]: 0 },
    };
    return this.model.findAll({
      where: whereClauses,
      order: fn('RAND'),
      limit: num,
      include: [
        {
          model: DBClient().user,
          required: true,
          attributes: ['idx', 'profile_image', 'nickname'],
        },
        {
          model: DBClient().song,
          required: true,
          attributes: ['title', 'thumbnail', 'singer'],
        },
      ],
      attributes: ['idx', 'file_idx'],
    });
  }
}

module.exports = HighlightRepository;
