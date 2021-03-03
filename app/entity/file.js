module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('files', {
    idx: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    underscored: true,
    paranoid: true,
  });
  return File;
};
