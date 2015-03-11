
var https = require("https");


exports.httpGet = function(options, callbackSuccess, callbackError){
    console.log('http get',options);
    try{
    var getReq = https.get(options, function (http_res) {
      console.log('Response is '+http_res.statusCode);
      // initialize the container for our data
      var data = "";

      // this event fires many times, each time collecting another piece of the response
      http_res.on("data", function (chunk) {
          // append this chunk to our growing `data` var
          data += chunk;
      });

      // this event fires *one* time, after all the `data` events/chunks have been gathered
      http_res.on("end", function () {
          // you can use res.send instead of console.log to output via express
          console.log("github data in ", data);
          if(data.indexOf('error')>-1 || http_res.statusCode>299){
            //expired token
             callbackError(data);
          }else{
            callbackSuccess(data);
          }


      });
    });


  }catch(e){
    console.log(e.stack);
    callbackError(e);
  }
}



exports.httpPost = function(options, dataOut,callbackSuccess, callbackError){
  console.log("HTTP POST IN", options, dataOut);
  try{
    var postReq = https.request(options, function (http_res) {
      console.log('Response is '+http_res.statusCode);
      // initialize the container for our data
      var data = "";

      // this event fires many times, each time collecting another piece of the response
      http_res.on("data", function (chunk) {
          // append this chunk to our growing `data` var
          data += chunk;
      });

      // this event fires *one* time, after all the `data` events/chunks have been gathered
      http_res.on("end", function () {
          // you can use res.send instead of console.log to output via express
          console.log("github data in ", data);
          if(data.indexOf('error')>-1 || http_res.statusCode>299){
            //expired token
             callbackError(data);
          }else{
            callbackSuccess(data);
          }


      });
    });
    // post the data
    postReq.write(dataOut);
    postReq.end();

  }catch(e){
    console.log(e.stack);
    callbackError(e);
  }
}
