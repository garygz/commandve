'use strict';

/* App Module */

angular.module('cmndvninja', ['ngResource', 'ngRoute', 'ngMessages', 'ui.ace']);

angular.module('cmndvninja'). config(['$routeProvider',function($routeProvider) {

    $routeProvider.when('/snippets/new', {
      templateUrl: 'app/partials/snippets/new.html',
      controller: 'SnippetController'
    });

    $routeProvider.when('/users', {
      templateUrl: 'app/partials/user-list.html',
      controller: 'UserController'
    });

    $routeProvider.when('/groups', {
      templateUrl: 'app/partials/groups/group-list.html',
      controller: 'GroupController'
    });

    $routeProvider.otherwise({redirectTo: '/'});

}]);
