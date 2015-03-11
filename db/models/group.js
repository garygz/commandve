module.exports = function(mongoose){
  var GroupSchema = mongoose.Schema({
    name: {type: String, required: true},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    image_url: {type: String, default: "app/img/default-group.png"},
    description: {type: String},
    created_at: {type: Date, default: Date.now },
    group_type: {type: String},
    updated_at: {type: Date},
    content_count: {type: Number, default: 0}
  });

  GroupSchema.index( {name: 1, user: 1}, {unique: true} );

  return mongoose.model('Group', GroupSchema);
};
