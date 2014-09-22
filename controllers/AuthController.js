var User = require('../models/User');

module.exports = {
  register: function (req, res) {
    console.log(req.body);

    User.findOne({email: req.body.email}, function(err, user){
      if(err){
        res.send({success: false, data: {}, errors: err}, 200);
      } else {
        if(!user){
          new User({email: req.body.email, password: req.body.password, name: req.body.fullName}).save(function(err, user){
            if(err){
              res.send({success: false, data: null, errors: err}, 200);
            } else {
              res.send({success: true, data: user, errors: null}, 200);
            }
          })
        } else {
          res.send({success: false, data: null, errors: 'User Already Exists'}, 200);
        }
      }
    });
  },
  login: function (req, res) {
    console.log('User Authenticated'.green);
    res.send({success: true, data: req.user, errors: null}, 200);
  },
  current: function (req, res){
    console.log(req.user);
    if(req.user){
      res.send({success: true, data: req.user, errors: null}, 200);
    } else {
      res.send({success: false, data: null, errors: 'Session Expired'}, 200);
    }
  },
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  }
};

