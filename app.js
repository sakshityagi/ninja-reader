var express = require('express');
var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var colors = require('colors');
var app = express();

//App Configuration
app.set('title', 'Ninja Reader');
app.set('port', process.env.PORT || 3001);
app.set('env', process.env.NODE_ENV || 'development');
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(express.cookieParser('sadaldjaljlwwqleladladauidyauidhasjgdadagdjadgja'));
app.use(express.cookieSession({'key': 'reader.sess'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

if(app.get('env') == 'development'){
  app.use(express.errorHandler());
  var db = mongoose.connection;
  db.on('error', console.error);
  db.on('open', function () {
    console.log("Connected to MongoDB running at:".green, 'mongodb://localhost/reader');
  });
  mongoose.connect('mongodb://localhost/reader');
}

global.__defineGetter__('_app', function () {
  return app;
});

global.__defineGetter__('_mongoose', function () {
  return mongoose;
});

global.__defineGetter__('_Schema', function () {
  return Schema;
});

global.__defineGetter__('_passport', function () {
  return passport;
});

app.listen(app.get('port'), function(){
  console.log('Reader server listening on port '.green + app.get('port'));
});

require('./config/URLMappings');