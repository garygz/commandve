'use strict';
/**
 * This parent controller for the entire app
 */
angular.module('cmndvninja').controller('cmndvninja', ['$scope', '$location', 'Shared','SearchItem',
    function($scope, $location, Shared, SearchItem) {

    $scope.isKeyEventEnter = function(event){
      return event.keyCode == 13;
    }

  }]);

