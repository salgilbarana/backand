module.exports = (sequelize, DataTypes) => {
    const ReviewHighlight = sequelize.define('review_highlights', {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parent_idx: {
        type: DataTypes.INTEGER,
        hierarchy: { throughTable: 'review_h_ancestors' },
        onDelete: 'CASCADE',
      },
      highlight_idx: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    }, {
      underscored: true,
    });
  
    ReviewHighlight.associate = (models) => {
      ReviewHighlight.belongsTo(models.highlight, {
        foreignKey: models.highlight.idx,
        onDelete: 'cascade',
      });
      ReviewHighlight.belongsTo(models.user, {
        foreignKey: models.user.idx,
      });
    };
  
    return ReviewHighlight;
  };
  