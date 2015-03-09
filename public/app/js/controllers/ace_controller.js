'use strict';

angular.module('cmndvninja'). controller('AceController',
  ['$scope',
  function($scope) {

  var editor = ace.edit("editor");

  $scope.themes = ['solarized_dark', 'eclipse'];
  $scope.modes = ['Ruby', 'XML', 'Javascript'];

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

}]);



