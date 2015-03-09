'use strict';

angular.module('cmndvninja'). controller('AceController',
  ['$scope',
  function($scope) {

  $scope.themes = ['solarized_dark', 'eclipse', 'Javascript'];
  $scope.theme = $scope.themes[0];

  $scope.aceOption = {
    theme: $scope.theme.toLowerCase(),
    onLoad: function (_ace) {

      $scope.themeChanged = function () {
        _ace.getSession().setTheme("ace/theme/" + $scope.theme.toLowerCase() + ".js");
        $scope.displayedTheme = $scope.theme;
      };

    }
  };

  $scope.modes = ['Scheme', 'XML', 'Javascript'];
  $scope.mode = $scope.modes[0];

  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {

      $scope.modeChanged = function () {
        _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
      };

    }
  };

}]);

