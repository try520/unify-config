module.exports = class extends baseLogic {
    constructor() {
        super();
    }

    /**
     * 获取应用分类
     */
    async getAppLabels() {
        let ret = await this.staticRes.base.query("select distinct app_label from (select app_label,app_order from app order by app_order asc ) as t");
        return ret;
    }
    /**
     * 获取应用列表
     */
    async getAppItems() {
        let ret = await this.staticRes.app.Access.findAll({
            attributes: ["app_id", "app_name", "app_label", "app_order"],
            order: [
                ["app_order", "asc"]
            ],
            raw: true
        });
        return ret;
    }

    /**
     * 检测appcode是否已经存在
     */
    async checkAppCode(appCode, appId) {
        let ret = await this.staticRes.app.Access.count({
            where: {
                app_code: appCode,
                app_id: {
                    '$ne': appId
                }
            },
            raw: true
        });
        return ret;
    }

    async checkConfigEnv(ac_appCode,ac_id,env){
        let ret = await  this.staticRes.app_config.Access.count({
            where:{
                ac_appCode:ac_appCode,
                ac_env:env,
                ac_id:{
                    '$ne':ac_id
                }
            },
            raw:true
        });
        return ret;
    }
    /**
     * 获取配置信息
     * @param {*} appCode 应用编码
     * @param {*} env  环境
     */
    async getAppConfigByappCode(appCode, env) {
        let item = await this.staticRes.app_config.Access.findOne({
            attributes: ["ac_config"],
            where: {
                ac_appCode: appCode,
                ac_env: env
            },
            raw: true
        });
        if (item) {
            return item["ac_config"];
        }
        return "";
    }

    /**
     * 获取应用详情
     * @param {*} appId 应用ID
     */
    async getAppInfo(appId) {
        let ret = await this.staticRes.app.Access.findOne({
            where: {
                app_id: appId
            },
            raw: true
        });
        return ret;
    }

    /**
     * 获取应用详情
     * @param {*} appCode 应用Code
     */
    async getAppInfoByCode(appCode) {
        let ret = await this.staticRes.app.Access.findOne({
            where: {
                app_code: appCode
            },
            raw: true
        });
        return ret;
    }





    async insertOrUpdateApp(_model) {
        let model = {};
        if (_model.app_id && _model.app_id !== '') {
            model = await this.getAppInfo(_model.app_id);
            if (!model) {
                return false;
            }
            model.UPDATE_TIME = this.moment().format("YYYY-MM-DD HH:mm:ss");
        } else {
            model.app_id = this.webTools.myuuid.createUUID();
            model.CREATE_TIME = this.moment().format("YYYY-MM-DD HH:mm:ss");
            model.UPDATE_TIME = this.moment().format("YYYY-MM-DD HH:mm:ss");
        }
        model.app_name = _model.app_name;
        model.app_label = _model.app_label;
        model.app_order = _model.app_order;
        model.app_code = _model.app_code;
        model.app_configDev = _model.app_configDev;
        model.app_configProd = _model.app_configProd;
        model.app_configMico = _model.app_configMico;
        model.app_configFront = _model.app_configFront;
        if (_model.app_id && _model.app_id !== '') {

            await this.staticRes.app.Access.update(model, {
                where: {
                    app_id: _model.app_id
                }
            });
        } else {
            model = await this.staticRes.app.Access.create(model);
        }

        return model;
    }

    async delApp(keys) {
        return await this.staticRes.app.Access.destroy({
            where: {
                app_id: keys
            }
        });
    }


    async getAppConfigByAppCode(appCode) {
        let ret = await this.staticRes.app_config.Access.findAll({
            where: {
                ac_appCode: appCode
            },
            raw: true
        });
        return ret;
    }

    async getAppConfig(ac_id) {
        let ret = await this.staticRes.app_config.Access.findOne({
            where: {
                ac_id: ac_id
            },
            raw: true
        });
        return ret;
    }

    async insertOrUpdateAppConfig(_model) {
        let model = {};
        if (_model.ac_id && _model.ac_id !== '') {
            model = await this.getAppConfig(_model.ac_id);
            if (!model) {
                return false;
            }
        } else {
            model.ac_id = this.webTools.myuuid.createUUID();
        }
        model.ac_appCode = _model.ac_appCode;
        model.ac_name = _model.ac_name;
        model.ac_env = _model.ac_env;
        model.ac_config = _model.ac_config;
        if (_model.ac_id && _model.ac_id !== '') {
            await this.staticRes.app_config.Access.update(model, {
                where: {
                    ac_id: model.ac_id
                }
            });
        } else {
            model = await this.staticRes.app_config.Access.create(model);
        }
        if(model){
            //推送通知
            global.mqttClient.sendMsg("static-res/configUpdate/"+model.ac_appCode+"/"+model.ac_env+"",JSON.stringify(model),0);
        }
        return model;
    }



    async delAppConfig(keys) {
        return await this.staticRes.app_config.Access.destroy({
            where: {
                ac_id: keys
            }
        });
    }
};
