/* eslint-disable object-shorthand */
const Sequelize = require('sequelize');
const Repository = require('./repository');

const { Op } = Sequelize;

class UserRepository extends Repository {
  async findByIdOrNickName(id, nickName) {
    const whereClauses = {
      [Op.or]: [
        { id: id },
        { nickname: nickName },
      ],
    };
    return this.model.findOne({
      where: whereClauses,
    });
  }
}

module.exports = UserRepository;
