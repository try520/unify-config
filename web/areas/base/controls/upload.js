var multiparty = require("multiparty");
module.exports = class extends baseController {
    constructor() {
        super();
        this.multiparty = require("multiparty");
        this.router.all('/config', this.getConfig.bind(this));
        this.router.post('/image', this.uploadImage.bind(this));
        this.router.post('/file', this.uploadFile.bind(this));
        this.router.post('/unzip', this.uploadUnzip.bind(this));
        this.router.post('/bigFile', this.uploadBigFile.bind(this));
        return this.router;
    }

    static init() {
        return new this();
    }

    /**
     *
     * @api {get} base/upload/config 获取上传配置
     * @apiVersion 1.0.0
     * @apiName getConfig
     * @apiGroup File
     *
     */
    getConfig(req, res) {
        let config = require('../upload-handler/config');
        res.json(config);
    }

    /**
     *
     * @api {post} base/upload/uploadImage 上传图片
     * @apiVersion 1.0.0
     * @apiName uploadImage
     * @apiGroup File
     * @apiParam {String} contentType 内容形式 (可为空，如果图片是base64编码字符串，那么contentType="base64")
     * @apiParam {String} upfile 存放图片的域或存放base64字符串的字段
     * @apiSuccessExample Success - Response:
           *
           HTTP / 1.1 200 OK *
           {
               *"state": 0, //0:成功，-1:超出大小限制,-2:不允许的类型,-3:文件访问出错，请检查写入权限,-4:网络错误
               *"relativeUrl": "/res/upload/img/20170101/xxx.jpg" //上传后的相对路径地址
               *"absolutelyUrl": "http://xxxx/res/upload/img/20170101/xxx.jpg" //上传后的绝对路径地址
           }
     */
    async uploadImage(req, res) {
        let contentType = req.query.contentType || '';
        if (contentType == 'base64') {
            await require('../upload-handler/upload-scrawl-handler')(req, res).handler();
        } else {
            await require('../upload-handler/upload-image-handler')(req, res).handler();
        }
    }

    /**
     *
     * @api {post} base/upload/uploadFile 上传文件
     * @apiVersion 1.0.0
     * @apiName uploadFile
     * @apiGroup File
     * @apiParam {file} upfile 存放文件的域
     * @apiSuccessExample Success - Response:
           *
           HTTP / 1.1 200 OK *
           {
               *"state": 0, //0:成功，-1:超出大小限制,-2:不允许的类型,-3:文件访问出错，请检查写入权限,-4:网络错误
               *"relativeUrl": "/res/upload/file/20170101/xxx.doc" //上传后的相对路径地址
               *"absolutelyUrl": "http://xxxx/res/upload/file/20170101/xxx.doc" //上传后的绝对路径地址
           }
     */
    async uploadFile(req, res) {
        await require('../upload-handler/upload-file-handler')(req, res).handler();
    }

    /**
     * 上传文件并解压 只支持zip http://localhost:3001/base/upload/unzip?dir=%2Fres%2Fj_header
     * @param {*} req
     * @param {*} res
     */
    /**
     *
     * @api {post} base/upload/unzip?dir=xxxx 上传文件并解压 只支持zip
     * @apiVersion 1.0.0
     * @apiName uploadUnzip
     * @apiGroup File
     * @apiParam {String} dir 解压目录 需要urlEncode 这是get参数 跟在url 后面 ?dir=xxxx
     * @apiParam {String} upfile 保存文件的域 这是post参数
     * @apiSuccessExample Success - Response:
           *
           HTTP / 1.1 200 OK *
           {
               *"state": 0 //0:成功，-1:超出大小限制,-2:不允许的类型,-3:文件访问出错，请检查写入权限,-4:网络错误

           }
     */
    async uploadUnzip(req, res) {
        await require('../upload-handler/upload-file-unzip-handler')(req, res).handler();
    }

    async uploadBigFile(req, res) {
        let form = new this.multiparty.Form({
            autoFields: true,
            autoFiles: false,
        });

        form.on('part', (part) => {
            form.on('aborted', () => {
                //意外退出或者暂停都会保存数据
                console.log('aborted');

            });
        });
    }



}
