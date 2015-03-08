// var app = angular.module('cmndvninja', ['ngRoute', 'ngMaterial']);
'use strict';

angular.module('cmndvninja').controller('cmndvninja', ['$scope', '$location', 'Shared','SearchItem',
    function($scope, $location, Shared, SearchItem) {

    $scope.isKeyEventEnter = function(event){
      return event.keyCode == 13;
    }

  }]);


  // angular.module('cmndvninja').config( function($mdThemingProvider){
  //   // Configure a dark theme with primary foreground yellow
  //   $mdThemingProvider.theme('docs-dark', 'default')
  //       .primaryPalette('green')
  //       .dark();
  // });
