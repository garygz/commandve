'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared',
  function($scope, $location, $route, Snippet, Shared){

  $scope.data = {};
  function createSnippet() {
    console.log('hello there')
  };

  $scope.greeting = 'hello there!';


  function newProduct() {
    $scope.mainHeader = "Create Product";
    $scope.product = {};
    $scope.product.is_new = true;
    Shared.product = null;
  }



  Snippet.query().$promise.then(function(snippets){
    $scope.data.snippets = snippets;
    Shared.snippets = null;
  });

}]);
