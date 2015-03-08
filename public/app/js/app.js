'use strict';

/* App Module */

angular.module('cmndvninja', ['ngResource', 'ngRoute', 'ngMessages', 'ui.ace',
                              'ui.bootstrap']);

angular.module('cmndvninja'). config(['$routeProvider',function($routeProvider) {

    $routeProvider.when('/groups', {
      templateUrl: 'app/partials/groups/group-list.html',
      controller: 'GroupController'
    });

    $routeProvider.when('/groups/:groupid/snippets', {
      templateUrl: 'app/partials/snippets/new.html',
      controller: 'SnippetController'
    });

    $routeProvider.when('/users', {
      templateUrl: 'app/partials/user-list.html',
      controller: 'UserController'
    });

    $routeProvider.when('/search', {
      templateUrl: 'app/partials/search/search-results.html',
      controller: 'SearchController'
    });

    $routeProvider.otherwise({redirectTo: '/groups'});

}]);
