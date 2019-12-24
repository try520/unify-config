
        module.exports = function() {
            let sequelize = require("../libs/db").sequelize;
            let Access = sequelize.import("../models/app_config");
            /**
             * 这是个实例
             */
            let Example=function(){

            };

            return {
                Access: Access,
                Example:Example
            }
        }();