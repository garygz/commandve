'use strict';

/* App Module */

angular.module('cmndvninja', ['ngResource', 'ngRoute', 'ngMaterial', 'ngMessages', 'ui.ace']);

angular.module('cmndvninja'). config(['$routeProvider',function($routeProvider) {

    $routeProvider.when('/snippets/new', {
      templateUrl: 'app/partials/snippets/new.html',
      controller: 'SnippetController'
    });

    $routeProvider.when('/users', {
      templateUrl: 'app/partials/user-list.html',
      controller: 'UserController'
    });

    $routeProvider.otherwise({redirectTo: '/'});

}]);
