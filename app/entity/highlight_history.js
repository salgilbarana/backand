module.exports = (sequelize, DataTypes) => {
    const HighlightHistory = sequelize.define('highlight_histories', {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_idx: {
        type: DataTypes.INTEGER,
      },
      highlight_idx: {
        type: DataTypes.INTEGER,
      },
    }, {
      underscored: true,
      paranoid: true,
    });
  
    HighlightHistory.associate = (models) => {
      HighlightHistory.belongsTo(models.user, {
        foreignKey: models.user.idx,
        onDelete: 'cascade',
      });
      HighlightHistory.belongsTo(models.highlight, {
        foreignKey: models.highlight.idx,
        onDelete: 'cascade',
      });
    };
  
    return HighlightHistory;
  };
  