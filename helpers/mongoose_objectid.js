var mongoose = require('mongoose');

exports.castToObjectId = function(stringId){
  var id = mongoose.Types.ObjectId(stringId);
  return id;
}

