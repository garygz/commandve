/*
This function allows to asynchrously execute multple jobs
while continueing execution only when all of the jobs are finished.
While we could use Promises instead,
that would slow down execution as it woule make all of the jobs synchrounious

 */
exports.syncUpJobs = function(jobList, callbackSuccess,callbackError){
  var totalJobs = jobList.length;
  var jobCount = 0;
  var onFinished = function(result){
    jobCount+=1;
    console.log('Async Job Finished',jobCount, 'out of ', totalJobs);
    if(totalJobs === jobCount){
      callbackSuccess(result);
    }
  };
  var onError = function(){
    console.log('Async error', callbackError);
    callbackError();
  };
  jobList.forEach(function(item){
    console.log('run async', item);
    item(onFinished,onError);
  });
};
