var controllers = {
  auth: require('../controllers/AuthController'),
  feed: require('../controllers/FeedController')
};

var LocalStrategy = require('passport-local').Strategy
var User = require('../models/User');

_passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email, password: password }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return done(null, user);
    });
  }
));

_passport.serializeUser(function (user, done) {
  done(null, user);
});

_passport.deserializeUser(function (user, done) {
  done(null, user);
});


_app.get('/', function(req, res){
  res.render('index', {title: _app.get('title')});
});
_app.post('/auth/register',controllers.auth.register);
_app.post('/auth/login', _passport.authenticate('local'),  controllers.auth.login);
_app.get('/auth/logout', controllers.auth.logout);
_app.get('/auth/current', controllers.auth.current);


//RSS Feed processing routes

_app.post('/feed/process', controllers.feed.processFeedLink);
_app.post('/feed/process/articles', controllers.feed.processArticles);
_app.get('/feed/fetch/articles', controllers.feed.fetchArticles);
_app.delete('/feed/article/:id', controllers.feed.deleteArticle);

