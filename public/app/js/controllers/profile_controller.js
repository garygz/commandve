'use strict';

angular.module('cmndvninja'). controller('ProfileController',
  ['$scope', '$location', 'User', 'Shared', 'userSnippets',
  function($scope, $location, User, Shared, userSnippets){

  console.log('ProfileController init', $location);
  
  var ret = User.getOne({id: "54fb829d14dd4922d507dff5" }).$promise
  ret.then(function(data) {
   $scope.userProfile = data; 
  });

  var snippets = userSnippets.query({id: "54fb829d14dd4922d507dff5" }).$promise
  snippets.then(function(data) {
    $scope.snippets = data;
  });

}]);
