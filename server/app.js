var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require('cors');

var app = express();

const corsOption = {
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowdHeaders: ['Content-Type', 'Authorization']
};

// app.use(cors(corsOption));

app.use((req, res, next) => {
    if (req.path !== '/' && !req.path.includes('.')) {
        res.set({
            'Access-Control-Allow-Credentials': true, //允許後端發送cookie
            'Access-Control-Allow-Origin': req.headers.orgin || '*', //任意域名都可以訪問
            'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //設置請求header格式和類型
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS', //允許支持的請求方式
            'Content-Type': 'application/json; charset=utf-8' //默認與允許的json格式和編碼格式
        })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;