angular.module('cmndvninja'). controller('toggleController', ['$scope', '$timeout',
  function($scope, $timeout, $location, $route, Snippet, Shared){

  $scope.groupsVisibility = false;
  $scope.groupsVisibilityFalse = true;


    $scope.groupsButton = "mdi-navigation-chevron-left";

    var changeGroupsVisibilityFalse = function () {
      $scope.groupsVisibilityFalse = true;
    }
    var consolelog = function(){
      console.log('wetf')
    }

    $scope.toggleGroupsButton = function(){
      $scope.groupsVisibility = !$scope.groupsVisibility;
      if ($scope.groupsVisibilityFalse === false) {
        $timeout(changeGroupsVisibilityFalse, 800);
      }else{
        $scope.groupsVisibilityFalse = false;
      }

    }

    // $scope.toggleVisibility = function(){
    //   if ($scope.groupsVisibility === "none"){
    //     $scope.groupsVisibility = "inherit"
    //   }else{
    //     $scope.groupsVisibility = "none"
    //   }
    // }

    $scope.toggleGroups = function () {
      // $scope.toggleVisibility();
      $scope.toggleGroupsButton();
    }




}]);

