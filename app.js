var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const BP = require('body-parser');

var indexRouter = require('./routes/index');



var app = express();


app.use(BP.json());


/*
    Lorsqu'on utilise Postman, les requêtes POST ne fonctionne pas toujours en Json, (apparemment c'est un problème récurrent sur le web
    du coup dans body sur postman j'ai coché x-www-form-urlencoded et le petit bout de code suivant est pour pouvoir exploiter ce format
 */
app.use(BP.urlencoded({
    extended: true
}));
app.use(BP.urlencoded())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/update', require('./updateData.js').router);

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
