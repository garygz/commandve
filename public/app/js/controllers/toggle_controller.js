/**
 * Controls popup group panel
 */

angular.module('cmndvninja').controller('toggleController', ['$scope', '$timeout',
  function($scope, $timeout, $location, $route, Snippet, Shared){

    $scope.groupsVisibility = false;
    $scope.groupsVisibilityFalse = true;

    var changeGroupsVisibilityFalse = function () {
      $scope.groupsVisibilityFalse = true;
    };

    $scope.toggleGroupsButton = function(){
      $scope.groupsVisibility = !$scope.groupsVisibility;
      if ($scope.groupsVisibilityFalse === false) {
        $timeout(changeGroupsVisibilityFalse, 800);
      }else{
        $scope.groupsVisibilityFalse = false;
      }

    };

    $scope.toggleGroups = function () {
      $scope.toggleGroupsButton();
    }




}]);

