'use strict';

/* App Module */

angular.module('cmndvninja', ['ngResource', 'ngRoute', 'ngMessages', 'ngCookies', 'ui.ace', 'ui.bootstrap', 'ngAnimate']);

angular.module('cmndvninja'). config(['$routeProvider',function($routeProvider) {

    $routeProvider.when('/groups', {
      templateUrl: 'app/partials/groups/group-list.html',
      controller: 'GroupController'
    });

    $routeProvider.when('/groups/:groupid/snippets', {
      templateUrl: 'app/partials/snippets/new.html',
      controller: 'SnippetController'
    });

    // Do we really need a list of all users page?
    $routeProvider.when('/users', {
      templateUrl: 'app/partials/user-list.html',
      controller: 'UserController'
    });

    $routeProvider.when('/search', {
      templateUrl: 'app/partials/search/search-results.html',
      controller: 'SearchController'
    });

    $routeProvider.when('/users/profile', {
      templateUrl: 'app/partials/users/profile.html',
      controller: 'ProfileController'
    })

    $routeProvider.when('/login', {
      templateUrl: 'app/partials/auth/login.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/signup', {
      templateUrl: 'app/partials/auth/signup.html',
      controller: 'AuthController'
    })

    $routeProvider.when('/suggest', {
      templateUrl: 'app/partials/users/suggest.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/downloads', {
      templateUrl: 'app/partials/users/downloads.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/aboutus', {
      templateUrl: 'app/partials/users/aboutus.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.otherwise({redirectTo: '/groups'});

}]);
