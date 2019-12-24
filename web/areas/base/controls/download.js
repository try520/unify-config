const fs = require('fs');
const path = require('path');
module.exports = class extends baseController {
    constructor() {
        super();
        this.router.get('/file', this.file.bind(this));
        return this.router;
    }


    /**
    *
    * @api {get} base/download/file 下载文件
    * @apiVersion 1.0.0
    * @apiName downLoadFile
    * @apiGroup File
    
    * @apiParam {String} path url编码后的文件路径
    *
    * 下载文件 http: //localhost:3001/base/download/file?path=%2Fres%2Fimages%2Fgroup.png.100x100.png
    *
    */
    file(req, res) {
        try {
            let resPath = req.query.path;
            var filePath = path.join(global.RootPath, 'www', resPath);
            if (fs.existsSync(filePath)) {
                let stats = fs.statSync(filePath);
                let _s2 = resPath.split('/');
                let fileName = _s2[_s2.length - 1];
                if (stats.isFile()) {
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': 'attachment; filename=' + fileName,
                        'Content-Length': stats.size
                    });
                    fs.createReadStream(filePath).pipe(res);
                } else {
                    res.end(404);
                }
            } else {
                res.send('请输入path参数');
            }

        } catch (err) {
            res.end(404);
        }
    }
}