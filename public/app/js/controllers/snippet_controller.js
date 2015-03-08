'use strict';

angular.module('cmndvninja'). controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared',
  function($scope, $location, $route, Snippet, Shared){

    var groupId = Shared.currentGroupId;

    function getSnippets() { Snippet.query({groupId: groupId}).$promise.then(
      function(snippets){
        $scope.snippets = snippets;
        $scope.currentSnippet = $scope.snippets[0];
        Shared.snippets = null;
        console.log(snippets);
    })};

    getSnippets();

    var myLocation = $location.absUrl();


    $scope.test1="test1";
    $scope.test2="test2";
    $scope.snippetIsNew = false;
    $scope.displayedLanguage= "Language"
    $scope.languages = [
      "Ruby",
      "Javascript",
      "Assembly",
    ];

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

    $scope.addNewSnippetToView = function () {

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

    $scope.selectTheme = function(themeName) {
      editor.setTheme("ace/theme/twilight")
    }




}]);
