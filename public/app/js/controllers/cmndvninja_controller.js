// var app = angular.module('cmndvninja', ['ngRoute', 'ngMaterial']);

angular.module('cmndvninja').controller('cmndvninja', ['$scope', '$mdSidenav', function($scope) {
    $scope.user = {
      title: '',
      language: '',
      firstName: '',
      lastName: '' ,
      company: 'Google' ,
      address: '1600 Amphitheatre Pkwy' ,
      city: 'Mountain View' ,
      state: 'CA' ,
      biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
      postalCode : '94043'
    };
  }]);


  angular.module('cmndvninja').config( function($mdThemingProvider){
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('pink')
        .dark();
  });
