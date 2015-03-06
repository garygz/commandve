module.exports = function(mongoose){
  var GroupSchema = mongoose.Schema({
    name: {type: String, required: true},
    user: {type: Mongoose.Schema.ObjectId, ref: 'User'}
  });

  GroupSchema.index( {name: 1, user: 1}, {unique: true} );

  return mongoose.model('Group', GroupSchema);
};
