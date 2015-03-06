'use strict';

angular.module('users'). controller('UserController',
  ['$scope', '$location', 'User', 'Shared',
  function($scope, $location, User, Shared){

  console.log('UserController init', $location);
  $scope.data = {};

  User.query().$promise.then(function(users){
    $scope.data.users = users;
    Shared.users = null;

  });

  // $scope.deleteOne = function(id) {
  //   Product.remove({id: id}).$promise.then(function(data){
  //    $scope.data.products = $scope.data.products.filter(function(ele){
  //     console.log(ele._id + " " + id);
  //     return ele._id !== id;
  //    });
  //   });
  // };

}]);
