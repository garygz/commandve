'use strict';

/**
 * Snippet CRUD controller
 *
 */

angular.module('cmndvninja').controller('SnippetController',
  ['$scope', '$location', '$route','Snippet', 'Shared','$timeout',
  function($scope, $location, $route, Snippet, Shared, $timeout){

    $scope.groups = Shared.groups;

    $scope.newSnippet = function () {
      $scope.currentSnippet = {
        group: groupId,
        theme: 'eclipse',
        groupId: groupId,
        isNew: true,
        tags: ["Javascript"],
        unique_handle: "My Snippet Name",
        id: undefined,
        content: ""
      };
      $scope.snippets.unshift($scope.currentSnippet);
      $scope.initializeAceState();
    };

    $scope.selectSnippet = function (snippet) {
      if(Shared.loggingEnabled) console.log($scope.snippets);
      $scope.currentSnippet = snippet;
      return $scope.currentSnippet;
    };

    $scope.selectIfNewSnippet = function (snippet){
      if (! snippet._id) {
        $scope.currentSnippet = snippet;
      }
    };

    var initialize = function  () {
      if (Shared.currentSearchedSnippetId) {
        $scope.selectSnippet(Shared.currentSearchedSnippetId);
        Shared.currentSearchedSnippedId = false;
      }
      else{
        if ($scope.currentSnippet){
          if(Shared.loggingEnabled) console.log('currentSnippet is defined as', $scope.currentSnippet)
        }else {
          $scope.newSnippet();
        }
      }
      if ($scope.currentSnippet.theme){
        $scope.theme = $scope.currentSnippet.theme;
      }
      if ($scope.currentSnippet.tags.length > 0){
        $scope.mode = $scope.currentSnippet.tags[0];
      }
    };

    var getGroupId = function(){
      var url = $location.absUrl();
      var beg = url.indexOf("groups") + "groups/".length;
      var end = url.indexOf("/snippet");
      return url.slice(beg, end);
    };

    var getSnippets = function () {
      Snippet.query({groupId: groupId}).$promise.then(
        function(snippets){
          $scope.snippets = snippets;
          $scope.currentSnippet = $scope.snippets[0];
          markSnippetsAsSaved(snippets);
          initialize();
          $scope.initializeAceState();
          if(Shared.loggingEnabled) console.log($scope.snippets);
          if(Shared.loggingEnabled) console.log('current snippet:', $scope.currentSnippet);
        }
      );
      return $scope.snippets;
    };

    var groupId = getGroupId();

    getSnippets();

    $scope.flagSnippet = function(){
      $scope.currentSnippet.saved = false;
    };

    var markOneSnippetAsSaved = function markOneSnippetAsSaved(snippet) {
      snippet.saved = true;
      snippet.isNew = false;
    };

    var markSnippetsAsSaved = function (snippets) {
      if ( snippets instanceof Array) {
        for (var i = 0; i < snippets.length; i++) {
          markOneSnippetAsSaved(snippets[i]);
        }
      } else {
          throw 'in markSnippetsAsSaved, snippets is not an array';
      }
      return snippets;
    };

    $scope.saveAllSnippets = function (){
      for (var i = 0; i < $scope.snippets.length; i++) {
        if ($scope.snippets[i].saved === false) {
          createOrEditSnippet($scope.snippets[i]);
        }
      }
      if(Shared.loggingEnabled) console.log($scope.snippets)
    };

    var createOrEditSnippet = function  (snippet) {
      snippet.user = Shared.userId;
      if (snippet.isNew) {
        createSnippet(snippet);
      } else {
        editSnippet(snippet);
      }
    };

    $scope.stageDelete = function (snippet) {
      $scope.snippetToDelete = snippet;
    };

    $scope.deleteSnippet = function () {
      var map = {groupId: $scope.snippetToDelete.group,
                id: $scope.snippetToDelete._id};

      $scope.snippets.splice(getIndexBy($scope.snippets, "_id", $scope.snippetToDelete._id), 1);
      loadNextSnippet();
      Snippet.remove(map);
    };

    var loadNextSnippet = function (){
      if ($scope.snippets.length > 0) {
        if(Shared.loggingEnabled) console.log('snippets is more than one:', $scope.snippets[0])
        $scope.currentSnippet = $scope.snippets[0];
        $scope.initializeAceState();
      }else {
        $scope.newSnippet();
      }
    };

    var createSnippet =  function  (snippet) {
      snippet.groupId = groupId;
      Snippet.post(snippet);
    };

    var editSnippet = function (snippet) {
      snippet.groupId = groupId;
      snippet.group = groupId;
      Snippet.update(snippet);
    };

    var getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
      }
    };

    var findById = function (source, id) {
      for (var i = 0; i < source.length; i++) {
        if (source[i]._id === id) {
        return source[i];
        }
      }
      throw "throwing error from findById in SnippetController: couldn't find object with id: " + id;
    };

    $scope.hover = function (snippet){
      snippet.showToolbar = ! snippet.showToolbar;
    };

    $scope.formatMinifiedViewContent = function (str) {
      if (str){
        return str.length > 175 ? str.substr(0, 175) + '...' : str;
      }
    };

    $scope.formatMinifiedViewTitle = function (str) {
      if (str){
        return str.length > 30 ? str.substr(0, 30) + '...' : str;
      }
    };

    $scope.showGroup = function(id){
      $location.path('groups/'+id + '/snippets');
      Shared.currentGroupId = id;
    };

  // snippet controller and ace controller are too interlinked
  // to be two separate controllers... TODO make ACE a service //

    var editor = ace.edit("editor");

    $scope.themes = ['eclipse', 'clouds', 'solarized_dark', 'solarized_light', 'dawn', 'dreamweaver', 'github' ];
    $scope.modes = ['Javascript', 'Ruby', 'XML', 'Python', 'HTML'];


    $scope.selectTheme = function(theme) {
      $scope.theme = theme;
      if ($scope.currentSnippet) {
      $scope.currentSnippet.theme = theme;
      }
      editor.setTheme("ace/theme/" + theme);
    };

    $scope.initializeAceState = function() {
      if ($scope.currentSnippet){
        if ($scope.currentSnippet.theme) {
          $scope.theme = $scope.currentSnippet.theme;
        }else {
        $scope.theme = $scope.themes[0];
        }
        if ($scope.currentSnippet.tags.length > 0) {
          if(Shared.loggingEnabled) console.log('mode should change to', $scope.currentSnippet.tags[0])
          $scope.mode = $scope.currentSnippet.tags[0];
        }else {
          $scope.mode = $scope.modes[0];
        }
      }else {
        $scope.theme = $scope.themes[0];
        $scope.mode = $scope.modes[0];
      }
      editor.setTheme("ace/theme/" + $scope.theme);
      editor.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
    };

    $scope.initializeAceState();


    // $scope.selectTheme($scope.theme);

    $scope.aceOption = {
      mode: $scope.mode.toLowerCase(),
      onLoad: function (_ace) {
        $scope.modeChanged = function (mode) {
          $scope.mode = mode;
          $scope.currentSnippet.tags[0] = mode;
          _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
        };

      }
    };

    $scope.formatFileName = function(str){
      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }
      function subUnderScoresForSpaces(str) {
        return str!=null?str.replace(/_/g, " "):"";
      }

      return toTitleCase(subUnderScoresForSpaces(str));
    };

    var session = editor.getSession();
    session.setUseWrapMode(true);
    session.setWrapLimitRange(80,80);

}]);
