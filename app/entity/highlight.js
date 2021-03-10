module.exports = (sequelize, DataTypes) => {
    const Highlight = sequelize.define('highlights', {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_idx: {
        type: DataTypes.INTEGER,
      },
      file_idx: {
        type: DataTypes.INTEGER,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        allowNull: false,
      },
    }, {
      underscored: true,
      paranoid: true,
    });
  
    Highlight.associate = (models) => {
      Highlight.belongsTo(models.user, {
        foreignKey: models.user.idx,
        onDelete: 'cascade',
      });
      Highlight.belongsTo(models.file, {
        foreignKey: models.file.idx,
        onDelete: 'cascade',
      });
      Highlight.hasMany(models.review_highlight, {
        foreignKey: models.highlight.idx,
        sourceKey: models.highlight.idx,
        as: 'rh',
        onDelete: 'cascade',
      });
      Highlight.hasMany(models.feedback_highlight, {
        foreignKey: models.highlight.idx,
        sourceKey: models.highlight.idx,
        as: 'fh',
        onDelete: 'cascade',
      });
    };
  
    return Highlight;
  };
  