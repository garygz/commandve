'use strict';

angular.module('cmndvninja'). controller('UserController',
  ['$scope', '$location', 'User', 'Shared', 'Auth',
  function($scope, $location, User, Shared, Auth){

  console.log('UserController init', $location);
  $scope.data = {};
  //for test only
  //setup after login
  $scope.clientId = "9e8ff83bdb61dae15c5c";
  $scope.user = null;//{username: "garygz76812736", _id:"54fcd6a07e409d9a82a4bec8"}

  var promise = Auth.login().$promise;
  promise.then(function(user){
    console.log("user logged in");
    $scope.user  = user;
    $location.path('/');
  }, function(reason) {
      console.log('login failed: ' + reason);
      $location.path('/login');
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
          console.log("search results", searchResults);
          $scope.searchResults = searchResults;
          $location.path("/search");
       });
    }

  }

}]);
