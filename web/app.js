require('marko/node-require'); //加入marko 模板的支持
let compression = require('compression');
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");

var cookieParser = require("cookie-parser");
var session = require('express-session');
var bodyParser = require("body-parser");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("RootPath", __dirname);



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression()); //启用gzip
app.use(logger("dev"));
app.use(bodyParser.json({
    limit: '5000mb'
}));
app.use(bodyParser.urlencoded({
    limit: '5000mb',
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'Kmlc@3302133',
    cookie: {
        //maxAge: 60000
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

app.use("/dist", express.static(path.join(__dirname, "www/dist")));
app.use("/static", express.static(path.join(__dirname, "www/static")));
app.use("/res", express.static(path.join(__dirname, "www/res")));
app.use("/upload", express.static(path.join(__dirname, "www/upload")));
app.use("/api-doc", express.static(path.join(__dirname, "www/api-doc")));


var router = require("./router");
router.GetRouter(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error",err);
});

module.exports = app;