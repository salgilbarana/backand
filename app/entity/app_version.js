module.exports = (sequelize, DataTypes) => {
  const AppVersion = sequelize.define('app_versions', {
    idx: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    agent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latest_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latest_version_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min_version_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_use_youtube_api: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_use_highlight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    charger_type: {
      type: DataTypes.INTEGER,
      enum: [0, 1, 2], /* *
                        * 0: BOTH
                        * 1: NBT
                        * 2: BUZZBILL
                        * */
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    underscored: true,
  });

  return AppVersion;
};
