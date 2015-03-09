'use strict';

angular.module('cmndvninja'). controller('UserController',
  ['$scope', '$location', 'User', 'Shared',
  function($scope, $location, User, Shared){

  console.log('UserController init', $location);
  $scope.data = {};
  //for test only
  //setup after login

  $scope.user = {username: "garygz76812736", _id:"54fcd6a07e409d9a82a4bec8"}
  $scope.userGroups = [
      {name: "HTML", description: "html stuff"},
      {name: "CSS", description: "css stuff"},
      {name: "Ruby", description: "ruby stuff"}];


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
