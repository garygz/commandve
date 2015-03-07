module.exports = function(mongoose){
  var GroupSchema = mongoose.Schema({
    name: {type: String, required: true},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    image_url: {type: String},
    description: {type: String},
    created_at: {type: Date, default: Date.now }
  });

  GroupSchema.index( {name: 1, user: 1}, {unique: true} );

  return mongoose.model('Group', GroupSchema);
};
