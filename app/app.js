var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var salerRouter = require('./routes/saler');
var svgRouter = require('./routes/svg');
var app = express();

// 模板引擎
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '500mb' }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));

//跨域处理
var corsOptions = {
  origin: 'http://127.0.0.1:8001',
  credentials: true,
  maxAge: '1728000'
}
app.use(cors(corsOptions))
//设置跨域


app.use('/', indexRouter);
app.use('/saler', salerRouter);
app.use('/users', usersRouter);
app.use('/lib', svgRouter);

// 错误处理
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
