/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('upload_file', {
    fid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    f_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    f_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    f_size: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    f_createTime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'upload_file'
  });
};
