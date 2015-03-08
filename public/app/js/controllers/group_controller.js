'use strict';

angular.module('cmndvninja'). controller('GroupController',
  ['$scope', '$location', 'User', 'Shared',
  function($scope, $location, User, Shared){

  console.log('GroupController init', $location);
  $scope.data = {};

  Group.query().$promise.then(function(groups){
    $scope.data.groups = groups;
    Shared.users = null;

  });

}]);
