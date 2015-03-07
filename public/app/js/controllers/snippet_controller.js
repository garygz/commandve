'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', 'Snippet', 'Shared',
  function($scope, $location, Snippet, Shared){

  console.log('SnippetController init', $location);
  $scope.data = {};
  $scope.greeting = 'hello there!';
  Snippet.query().$promise.then(function(snippets){
    $scope.data.snippets = snippets;
    Shared.snippets = null;
  });

}]);