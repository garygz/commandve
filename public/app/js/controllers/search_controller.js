'use strict';

/**
 * Controls the search bar
 */

angular.module("cmndvninja").controller("SearchController",
['$scope', '$location', '$route','SearchItem','Shared',

  function($scope, $location, $route, SearchItem, Shared){
    if(Shared.loggingEnabled) console.log("Search Controller init");
    //read location query string and do search
    $scope.searchResults = Shared.searchResults;

    $scope.goToSnippet = function(snippet){
      console.log(snippet);
    Shared.currentSearchedSnippetId = snippet._id;
    Shared.currentGroupId = snippet.group;
    $location.path('groups/'+ snippet.group + '/snippets');
    }

  }
]);
