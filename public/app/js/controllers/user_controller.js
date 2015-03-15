'use strict';

angular.module('cmndvninja'). controller('UserController',
  ['$scope', '$location', 'User', 'Shared', 'Auth',
  function($scope, $location, User, Shared, Auth){

  $scope.data = {};
  //for test only
  //setup after login
  $scope.clientId = null;//Get it from the server "9e8ff83bdb61dae15c5c";
  $scope.user = null;

  var isLoginRequiredForPage = function(){
    if ($location.path().indexOf('aboutus')>-1 ||
        $location.path().indexOf('downloads')>-1 ||
        $location.path().indexOf('getstarted')>-1
        ){
      return false;
    }else{
      return true;
    }
  }

  Auth.login({mode:1}).$promise.then(function(resource){

    $scope.clientId = resource.clientId;
    Shared.appMode = resource.mode;
    Shared.loggingEnabled = resource.log === "true";
    if(Shared.loggingEnabled) console.log("appMode", resource);
  },
  function(reason){
    console.log('failed to get client id: ' + reason);
  });

  var promise = Auth.login().$promise;
  promise.then(function(user){
    if(Shared.loggingEnabled) console.log("user logged in");
    $scope.user = user;
    Shared.userId = user._id
    $location.path('/');
  }, function(reason) {
      console.log('login failed: ' + reason);
      if(isLoginRequiredForPage()){
        $location.path('/login');
      }

  });



  $scope.search = function(searchCriteria, options){
    // Shared.searchCriteria = searchCriteria;
    // Shared.searchOptions = options;
    // console.log("invoke search");
    // var searchCriteria = Shared.searchCriteria;
    // console.log("search for",searchCriteria);

    if(searchCriteria && searchCriteria.trim().length>0){
       SearchItem.query({query:searchCriteria, limit: 50, type: "webapp"}).$promise.then(
        function(searchResults){
          if(Shared.loggingEnabled) console.log("search results", searchResults);
          $scope.searchResults = searchResults;
          $location.path("/search");
       });
    }

  }

}]);
