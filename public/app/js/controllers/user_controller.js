'use strict';

angular.module('cmndvninja'). controller('UserController',
  ['$scope', '$location', 'User', 'Shared',
  function($scope, $location, User, Shared){

  console.log('UserController init', $location);
  $scope.data = {};
  //for test only
  //setup after login
  $scope.user = {username: "garygz76812736", _id:"54fb97b211a8fdea326df321"}


  // $scope.deleteOne = function(id) {
  //   Product.remove({id: id}).$promise.then(function(data){
  //    $scope.data.products = $scope.data.products.filter(function(ele){
  //     console.log(ele._id + " " + id);
  //     return ele._id !== id;
  //    });
  //   });
  // };

}]);
