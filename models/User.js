var UserSchema = new _Schema({
  "name": String,
  "email": String,
  "password": String,
  "dateCreated": Date,
  "isActive": Boolean
});

UserSchema.statics.findOneByObjectId = function (id, callback) {
  return this.findOne({_id: id}, callback);
};

UserSchema.statics.findOrCreate = function (criteria, profile, callback) {
  var self = this;
  return this.findOne(criteria, function (err, user) {
    if (err) return callback(err, null);
    if (user) return callback(null, user);
    return self.saveUser(profile, callback);
  });
};

UserSchema.statics.saveUser = function (user, callback) {
  var instance = new this({
    "name": user.fullName,
    "email": user.email,
    "password": user.password,
    "dateCreated": +new Date()
  });

  return instance.save(function(err, user){
    if(err) return callback(err, null);
    return callback(null, user);
  });
};

module.exports = _mongoose.model('User', UserSchema);