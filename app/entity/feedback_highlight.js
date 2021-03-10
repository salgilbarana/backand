module.exports = (sequelize, DataTypes) => {
    const FeedbackHighlight = sequelize.define('feedback_highlights', {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      highlight_idx: {
        type: DataTypes.INTEGER,
      },
      file_idx: {
        type: DataTypes.INTEGER,
      },
      user_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      score: {
        type: DataTypes.INTEGER,
        validate: {
          len: [1, 5],
        },
      },
    }, {
      underscored: true,
    });
  
    FeedbackHighlight.associate = (models) => {
      FeedbackHighlight.belongsTo(models.highlight, {
        foreignKey: models.highlight.idx,
        onDelete: 'cascade',
      });
      FeedbackHighlight.belongsTo(models.file, {
        foreignKey: models.file.file_idx,
      });
      FeedbackHighlight.belongsTo(models.user, {
        foreignKey: models.user.idx,
      });
    };
  
    return FeedbackHighlight;
  };
  