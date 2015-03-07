'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared',
  function($scope, $location, $route, Snippet, Shared){
  
    $scope.formData = {
      user: '54f9fe5f2913f1f928a09fea'
    };


    $scope.data = {};
    $scope.createSnippet = function () {
      console.log($scope.formData)
      Snippet.post($scope.formData)
    };


  $scope.snippets = ["snippet", "snippet1"]
  $scope.greeting = 'hello there!';



  Snippet.query().$promise.then(function(snippets){
    $scope.data.snippets = snippets;
    Shared.snippets = null;
    console.log(snippets)
  });

}]);
