const fs=require('fs');
module.exports =  class {
    constructor(app,port) {
        this.app=app;
        this.https = require('https');
        this.port = port;
        this.options = {
            key: fs.readFileSync(__dirname + '/../keys/server.key'),
            cert: fs.readFileSync(__dirname + '/../keys/server.crt')
        };
        this.log = global.log;
    }

    static  init(app,port){
        return new this(app,port);
    }

    createServer(){
        let server = this.https.createServer(this.options,this.app).listen(this.port);
        server.on('error', this.onError.bind(this));
        server.on('listening', this.onListening.bind(this));
        return server;
    }

    onListening() {
        log.info(`https 服务启动成功,进程ID：${process.pid}`);
    }

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                this.log.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                this.log.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}