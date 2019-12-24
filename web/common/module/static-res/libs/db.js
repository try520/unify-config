
       
module.exports =new class{
    constructor() {
        this.config = global.Config;
        this.sequelize=this.getSequelize();

    }


    getSequelize(){
        let Sequelize = require('sequelize');
        let sequelize = new Sequelize(this.config.StaticRes.dbName, this.config.StaticRes.user, this.config.StaticRes.pwd, {
            host: this.config.StaticRes.host,
            port:this.config.StaticRes.port,
            dialect: this.config.StaticRes.dialect,
            logging: this.config.StaticRes.logging,
            timezone: '+08:00',
            pool: {
                minConnections: 2,
                maxIdleTime: 1000 * 30
            },
            define: {
                timestamps: false,
                createdAt: false,
                updatedAt: false
            }
        });
        return sequelize;
    }

    async query(sql,model){
          return await this.sequelize.query(sql, {
              replacements:model,
              type: this.sequelize.QueryTypes.SELECT
          });
    }

};
        