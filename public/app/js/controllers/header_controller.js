angular.module('cmndvninja').controller('HeaderController', ['$scope', '$location', 'Shared', function($scope, $location, Shared){
  console.log('Header init');

  // $scope.$watch( function() { return Shared; }, function(data) {
  //   console.log('Shared init');
  // }, true);

  // This should hide the nav given the location designated in the 
  $scope.hideNav = function(viewLocation){
  	return viewLocation === $location.path();
  }

}]);
