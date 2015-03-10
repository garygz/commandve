var mongoose = require('mongoose');

exports.castToObjectId = function(stringId){

  var id = mongoose.Types.ObjectId(stringId);
  console.log("cast objectid", id);
  return id;
}

