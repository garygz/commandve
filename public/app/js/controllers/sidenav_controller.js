angular.module('cmndvninja')
.controller('SidenavController', function ($scope, $mdSidenav) {
    $scope.toggleMenu = function() { $mdSidenav('right').toggle(); };
})
