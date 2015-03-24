"use strict";

var https = require("https");

var processData = function(callbackSuccess, callbackError){
  return function(httpRes){
    console.log('Response is '+httpRes.statusCode);
        // initialize the container for our data
        var data = "";

        httpRes.on("data", function (chunk) {
            //append a new chunk of read data
            data += chunk;
        });

       //this event is fired once the end of data is reached
        httpRes.on("end", function () {
            console.log("github data in ", data);
            if(data.indexOf('error')>-1 || httpRes.statusCode>299){
              //error message or status encountered
               callbackError(data);
            }else{
              callbackSuccess(data);
            }
        });
  }
}


exports.httpGet = function(options, callbackSuccess, callbackError){
    console.log('http get',options);
    try{
      var httpProcessDataCallBack = processData(callbackSuccess,callbackError);
      https.get(options, httpProcessDataCallBack);
    }catch(e){
      console.log(e.stack);
      callbackError(e);
    }
}



exports.httpPost = function(options, dataOut,callbackSuccess, callbackError){
  console.log("HTTP POST IN", options, dataOut);
  try{
    var httpProcessDataCallBack = processData(callbackSuccess,callbackError);
    var postReq = https.request(options, httpProcessDataCallBack);
    // post the data
    postReq.write(dataOut);
    postReq.end();

  }catch(e){
    console.log(e.stack);
    callbackError(e);
  }
}
