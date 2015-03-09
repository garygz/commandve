angular.module('cmndvninja').controller('HeaderController', ['$scope', '$location', '$cookieStore',  'Shared', function($scope, $location, $cookieStore, Shared){
  console.log('Header init');

  // $scope.$watch( function() { return Shared; }, function(data) {
  //   console.log('Shared init');
  // }, true);

  // This should hide the nav given the location designated in the 
  $scope.hideNav = function(viewLocation){
  	return viewLocation === $location.path();
  }

  // $scope.logout = function(){
  // 	$cookieStore.remove('token')
  // 	console.log("Removed cookie!")
  // 	$location.path('/')
  // }

  $scope.check_token = function(){
  	debugger
  	!!($cookieStore.get('token'))
  }

}]);
