'use strict';

angular.module('cmndvninja'). controller('AceController',
  ['$scope',
  function($scope) {

  var editor = ace.edit("editor");

  $scope.themes = ['eclipse', 'solarized_dark'];
  $scope.modes = ['Javascript', 'Ruby', 'XML'];

  $scope.theme = $scope.themes[0];
  $scope.mode = $scope.modes[0];

  $scope.selectTheme = function(theme) {
    $scope.theme = theme;
    editor.setTheme("ace/theme/" + theme);
  }

  $scope.selectTheme($scope.theme);

  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
      $scope.modeChanged = function (mode) {
        $scope.mode = mode;
        _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
      };

    }
  }
  var session = editor.getSession()
  session.setUseWrapMode(true)
  session.setWrapLimitRange(80,80)
}]);



