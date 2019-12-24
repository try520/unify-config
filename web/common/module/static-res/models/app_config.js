/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('app_config', {
    ac_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    ac_appCode: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'app',
        key: 'app_code'
      }
    },
    ac_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ac_env: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ac_config: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'app_config'
  });
};
