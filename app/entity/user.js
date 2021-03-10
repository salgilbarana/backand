const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    idx: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: DataTypes.STRING.BINARY,
      allowNull: true,
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    access_token: {
      type: DataTypes.STRING.BINARY,
      allowNull: true,
    },
    plain_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING,
    },
    nickname: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'undefined'),
      defaultValue: 'undefined',
      allowNull: false,
      validate: {
        isIn: {
          args: [['male', 'female', 'undefined']],
          msg: 'Must be male/female/undefined',
        },
      },
    },
    birthday: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_allow_privacy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    high_option: {
      type: DataTypes.ENUM('RANDOM', 'DENY', 'MALE', 'FEMALE'),
      defaultValue: 'RANDOM',
      allowNull: false,
      validate: {
        isIn: {
          args: [['RANDOM', 'DENY', 'MALE', 'FEMALE']],
          msg: 'Must be RANDOM/DENY',
        },
      },
    },
    fcm_token: {
      type: DataTypes.STRING,
    },
  }, {
    underscored: true,
  });
  User.associate = (models) => {
    User.belongsToMany(models.room, {
      through: {
        model: models.join_room,
        unique: false,
      },
      sourceKey: models.user.idx,
      targetKey: models.join_room.user_idx,
      onDelete: 'cascade',
    });
  };
  User.prototype.createToken = (value) => bcrypt.hash(value, bcrypt.genSaltSync(8));
  return User;
};
