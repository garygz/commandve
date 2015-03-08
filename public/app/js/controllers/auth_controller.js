

angular.module('cmndvninja').controller('AuthController',
  ['$scope', '$location', '$cookies', 'User', 'Shared', 'auth',
  function($scope, $location, $cookies, User, Shared, auth){
  
  'use strict';
  
  console.log('AuthController init', $location);

  $scope.login = function(user_info){
    console.log(user_info); // This is approprately passing username and password
    auth.login(user_info).$promise.then(function(data){
      $cookies.put('token', data._id);
    });
    $location.path('/#/users/profile').replace();
  };

  $scope.signup = function(user_info){
    User.post(user_info).$promise.then(function(data){
      $cookies.put('token', data._id);
    });
    $location.path('/#/users/profile').replace();
  };

}]);