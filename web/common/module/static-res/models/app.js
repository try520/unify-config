/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('app', {
    app_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    app_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    app_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    app_label: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    app_order: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    app_configDev: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    app_configProd: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    app_configMico: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    app_configFront: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CREATE_TIME: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UPDATE_TIME: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'app'
  });
};
