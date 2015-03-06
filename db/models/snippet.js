module.exports = function(mongoose){
  var SnippetSchema = mongoose.Schema({
    content: {type: String, required: true},
    tags: [String],
    user: {type: Mongoose.Schema.ObjectId, ref: 'User'},
    group: {type: Mongoose.Schema.ObjectId, ref: 'Group'}
  });

  SnippetSchema.createIndex( { content: "text", tags: "text" } , { name: "SnippetIndex" })

  return mongoose.model('Snippet', SnippetSchema);
};
