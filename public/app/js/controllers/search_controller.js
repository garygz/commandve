'use strict';

angular.module("cmndvninja").controller("SearchController",
['$scope', '$location', '$route','SearchItem','Shared',

  function($scope, $location, $route, SearchItem, Shared){
    console.log("Search Controller init");
    //read location query string and do search
    $scope.searchResults = Shared.searchResults;

    $scope.goToSnippet = function(snippet){
      console.log(snippet);
    Shared.currentSearchedSnippet = snippet;
    Shared.currentGroupId = snippet.group;
    $location.path('groups/'+ snippet.group + '/snippets');
    }

  }
]);
