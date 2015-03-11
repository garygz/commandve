module.exports = function(mongoose){
  var SnippetSchema = mongoose.Schema({
    content: {type: String, required: true},
    tags: [String],
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    group: {type: mongoose.Schema.ObjectId, ref: 'Group'},
    unique_handle: {type: String, default: "New Snippet (" + (new Date()).toDateString() + ")",  required: true},
    githubId: {type: String},
    githubFileName: {type: String},
    editor_theme: {type: String}
  });

  SnippetSchema.index( { content: "text", tags: "text" } , { name: "SnippetIndex" })

  return mongoose.model('Snippet', SnippetSchema);
};
