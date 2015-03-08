'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared',
  function($scope, $location, $route, Snippet, Shared){

    $scope.test1="test1";
    $scope.test2="test2";
    $scope.snippetIsNew = false;

    $scope.languages = [
      "Ruby",
      "Javascript",
      "Assembly",
    ];

    $scope.newSnippet = function () {
      $scope.snippetIsNew = true;
      $scope.currentSnippet = {
      }
    };

    $scope.createOrEditSnippet = function () {
      console.log($scope.currentSnippet);
      $scope.currentSnippet.user = "54fb6fd500f914a0a09e54b2";
      if ($scope.snippetIsNew) {
        createSnippet();
      } else {
        editSnippet();
      }
    };

    $scope.deleteSnippet = function (snippet) {
      Snippet.remove(snippet);
    }

    function createSnippet () {
      console.log('creating snippet:', $scope.currentSnippet);
      Snippet.post($scope.currentSnippet);
    };

    function editSnippet () {
      console.log('editing snippet:', $scope.currentSnippet);
      Snippet.update($scope.currentSnippet);
    };


    function findById(source, id) {
      for (var i = 0; i < source.length; i++) {
        if (source[i]._id === id) {
        return source[i];
        };
      };
      throw "throwing error from findById: couldn't find object with id: " + id;
    ;}

    $scope.selectSnippet = function (id) {
      $scope.currentSnippet = findById($scope.snippets, id);
      $scope.snippetIsNew = false;
      return $scope.currentSnippet;
    }


    Snippet.query().$promise.then(function(snippets){
      $scope.snippets = snippets.slice(0,5);
      $scope.currentSnippet = $scope.snippets[0];
      Shared.snippets = null;
      console.log(snippets);
    });

}]);
