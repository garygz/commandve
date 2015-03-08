'use strict';

angular.module('cmndvninja').controller('GroupController',
  ['$scope', '$location', 'Group', 'Shared',
  function($scope, $location, Group, Shared){

  console.log('GroupController init', $location);
  $scope.groupData = {};
  Shared.user = "54fb97b211a8fdea326df321";

  Group.query({userId:Shared.user}).$promise.then(function(groups){
    $scope.groupData.groups = groups;
    //TODO remove this
    //This should be a logged in user id


  });

}]);
