angular.module('cmndvninja'). controller('toggleController', ['$scope',
  function($scope, $location, $route, Snippet, Shared){

  $scope.groupsButtonStatus = false;
    $scope.groupsVisibility = "none";
    $scope.groupsButton = "mdi-navigation-chevron-right";

    $scope.toggleGroupsButton = function(){
      $scope.groupsButtonStatus = !$scope.groupsButtonStatus;
      if ($scope.groupsButtonStatus) {
        $scope.groupsButton = "mdi-navigation-chevron-left";
      }else {
        $scope.groupsButton = "mdi-navigation-chevron-right";
      }
    }

    $scope.toggleVisibility = function(){
      if ($scope.groupsVisibility === "none"){
        $scope.groupsVisibility = "inherit"
      }else{
        $scope.groupsVisibility = "none"
      }
    }

    $scope.toggleGroups = function () {
      $scope.toggleVisibility();
      $scope.toggleGroupsButton();
    }


}]);

