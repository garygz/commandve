module.exports = function(mongoose){
  var UserSchema = mongoose.Schema({
    username: {type: String, required: true, index: {unique:true}},
    email: {type: String, required: true, index: {unique:true}},
    password: {type: String, required: true} //TODO add bcrypt
  });

  return mongoose.model('User', UserSchema);
};
