'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared',
  function($scope, $location, $route, Snippet, Shared){

  $scope.createSnippet = function () {
    console.log('hello')
  };

  $scope.snippets = ["snippet", "snippet1"]
  $scope.greeting = 'hello there!';


  // function newSnippet() {
  //   $scope.mainHeader = "Create Product";
  //   $scope.snippet= {};
  // }



  // Snippet.query().$promise.then(function(snippets){
  //   $scope.data.snippets = snippets;
  //   Shared.snippets = null;
  // });

}]);
