'use strict';

/* App Module */

angular.module('users', ['ngResource', 'ngRoute']);

angular.module('users'). config(['$routeProvider',function($routeProvider) {
    // $routeProvider.when('/main', {templateUrl: 'views/list.html', controller: 'MainController'});
    // $routeProvider.when('/detail/:id', {templateUrl: 'views/show.html', controller: 'DetailController'});
    // $routeProvider.when('/edit/:id', {templateUrl: 'views/form.html', controller: 'FormController'});
    // $routeProvider.when('/new', {templateUrl: 'views/form.html', controller: 'FormController'});
    // $routeProvider.otherwise({redirectTo: '/main'});
    $routeProvider.when('/users', {templateUrl: 'app/partials/user-list.html', controller: 'UserController'});
    $routeProvider.otherwise({redirectTo: '/users'});

}]);

