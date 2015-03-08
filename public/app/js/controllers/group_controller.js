'use strict';

angular.module('cmndvninja').controller('GroupController',
  ['$scope', '$location', 'Group', 'Shared',
  function($scope, $location, Group, Shared){

  console.log('GroupController init', $location);
  $scope.groupData = {};
  $scope.$parent.userGroups = {};

  Group.query({userId:$scope.$parent.user._id}).$promise.then(function(groups){
    $scope.groupData.groups = groups;
    $scope.$parent.userGroups = groups;
  });

  $scope.showGroup = function(id){
    $location.path('groups/'+id + '/snippets');
    console.log($location.path());
  }

}]);
