'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared',
  function($scope, $location, $route, Snippet, Shared){

    $.material.ripples()

    var func = function(){
      var url = $location.absUrl();
      var beg = url.indexOf("groups") + "groups/".length;
      var end = url.indexOf("/snippet")
      return url.slice(beg, end)
    };

    var groupId = func();

    function getSnippets() { Snippet.query({groupId: groupId}).$promise.then(
      function(snippets){
        $scope.snippets = snippets;
        $scope.currentSnippet = $scope.snippets[0];
        Shared.snippets = null;
        console.log(snippets);
    })};

    var modifiedSnippets = [];

    getSnippets();
    $scope.snippetIsNew = false;

    $scope.newSnippet = function () {
      $scope.snippetIsNew = true;
      $scope.currentSnippet = {
        tags: ["Languages"],
        unique_handle: "My Snippet Name",
        id: undefined,
        content: ""
      }
      $scope.snippets.unshift($scope.currentSnippet);
    };

    $scope.createOrEditSnippet = function () {
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
      $scope.currentSnippet.groupId = groupId;
      console.log($scope.currentSnippet);
      Snippet.post($scope.currentSnippet);
    };

    function editSnippet () {
      console.log('editing snippet:', $scope.currentSnippet);
      $scope.currentSnippet.groupId = groupId;
      Snippet.update($scope.currentSnippet);
    };


    function findById(source, id) {
      for (var i = 0; i < source.length; i++) {
        if (source[i]._id === id) {
        return source[i];
        };
      };
      throw "throwing error from findById in SnippetController: couldn't find object with id: " + id;
    ;}

    $scope.selectSnippet = function (id) {
      $scope.currentSnippet = findById($scope.snippets, id);
      $scope.snippetIsNew = false;
      return $scope.currentSnippet;
    }

    $scope.selectLanguage = function (language) {
      $scope.currentSnippet.tags[0] = language;
      $scope.displayedLanguage = language;
    }

    $scope.hover = function (snippet){
      snippet.showToolbar = ! snippet.showToolbar;
    }

    $scope.formatMinifiedViewContent = function (str) {
      return str.length > 175 ? str.substr(0, 175) + '...' : str;
    }

    $scope.formatMinifiedViewTitle = function (str) {
      return str.length > 30 ? str.substr(0, 30) + '...' : str;
    }






}]);
