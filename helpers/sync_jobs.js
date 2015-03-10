

exports.syncUpJobs = function(jobList, callbackSuccess,callbackError){
  var totalJobs = jobList.length;
  var jobCount = 0;
  var onFinished = function(result){
    jobCount+=1;
    console.log('Asyn Job Finished',jobCount, 'out of ', totalJobs);
    if(totalJobs === jobCount){
      callbackSuccess(result);
    }
  }
  var onError = function(){
    console.log('Async error', callbackError);
    callbackError();
  }
  jobList.forEach(function(item){
    console.log('run async', item);
    item(onFinished,onError);
  });
}
