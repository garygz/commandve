/**
 * Navigation bar controller
 */

angular.module('cmndvninja').controller('HeaderController', ['$scope', '$location', 'Shared', function($scope, $location, Shared){
  // This should hide the nav given the location passed
  $scope.hideNav = function(viewLocation){
  	return viewLocation === $location.path();
  }

}]);
