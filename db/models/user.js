module.exports = function(mongoose){
  var UserSchema = mongoose.Schema({
    username: {type: String, required: true, index: {unique:true}},
    email: {type: String, required: true, index: {unique:true}},
    password: {type: String} ,//TODO not used for now as we utilize github
    token: {type: String},
    refreshToken: {type: String},
    githubId: {type: String}
  });

  return mongoose.model('User', UserSchema);
};
