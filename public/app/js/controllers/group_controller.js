'use strict';

angular.module('cmndvninja').controller('GroupController',
  ['$scope', '$location', 'Group', 'Shared',
  function($scope, $location, Group, Shared){

  console.log('GroupController init', $location);
  $scope.groupData = {};


  Group.query({userId:$scope.$parent.user._id}).$promise.then(function(groups){
    $scope.groupData.groups = groups;
    //TODO remove this
    //This should be a logged in user id


  });

  $scope.showGroup = function(id){
    $scope.$location.path='#/groups/'+id;
  }

}]);
