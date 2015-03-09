'use strict';

angular.module('cmndvninja').controller('AuthController',
  ['$scope', '$location', '$cookies', 'User', 'Shared', 'auth',
  function($scope, $location, $cookies, User, Shared, auth){



  console.log('AuthController init', $location);
  // Client ID
  // 9e8ff83bdb61dae15c5c
  // Client Secret
  // 13a3d9632063f5f9229c17e9b704d1c9ae620f1d

  $scope.clientKey = "9e8ff83bdb61dae15c5c";

  $scope.login = function(user_info){
    // console.log(user_info); // This is approprately passing username and password
    // auth.login(user_info).$promise.then(function(data){
    //   console.log(data);
    // });
  };

  $scope.signup = function(user_info){
    // User.post(user_info).$promise.then(
    //   function(data){
    //     if(data instanceof Array){
    //       document.getElementsByClassName('initiallyHidden').className.replace(/\binitiallyHidden\b/, '')
    //     }
    //     else{
    //       console.log(data);
    //       $cookies.put('token', data._id);
    //       $location.path('/#/users/profile').replace();
    //     }
    //   }
    // );
  };

}]);
