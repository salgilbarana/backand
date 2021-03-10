module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('rooms', {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      room: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      max: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: false,
        validate: { min: 2 },
      },
      highlight_idx: {
        type: DataTypes.INTEGER,
      },
      feedback_highlight_idx: {
        type: DataTypes.INTEGER,
      },
    }, {
      underscored: true,
      paranoid: true,
    });
    Room.associate = (models) => {
      Room.belongsTo(models.feedback_highlight, {
        foreignkey: models.feedback_highlight.idx,
        onDelete: 'cascade',
      });
      Room.belongsTo(models.highlight, {
        foreignkey: models.highlight.idx,
        onDelete: 'cascade',
      });
      Room.belongsToMany(models.user, {
        through: {
          model: models.join_room,
          unique: false,
        },
        sourceKey: models.room.idx,
        targetKey: models.join_room.room_idx,
      });
    };
    return Room;
  };
  