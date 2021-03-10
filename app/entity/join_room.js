module.exports = (sequelize, DataTypes) => {
    const JoinRoom = sequelize.define('join_rooms', {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_idx: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room_idx: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_exit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      underscored: true,
      paranoid: true,
    });
    JoinRoom.associate = (models) => {
      JoinRoom.belongsTo(models.user, {
        foreignKey: models.join_room.user_idx,
        onDelete: 'cascade',
      });
      JoinRoom.belongsTo(models.room, {
        foreignKey: models.join_room.room_idx,
        onDelete: 'cascade',
      });
      JoinRoom.belongsTo(models.join_room, {
        foreignKey: 'room_idx',
        targetKey: 'room_idx',
        as: 'parent',
      });
    };
    return JoinRoom;
  };
  