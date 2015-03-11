// 'use strict';

// angular.module('cmndvninja').controller('AceController',
//   ['$scope',
//   function($scope) {

//   var editor = ace.edit("editor");

//   $scope.themes = ['eclipse', 'clouds', 'solarized_dark', 'solarized_light', 'dawn', 'dreamweaver', 'github' ];
//   $scope.modes = ['Javascript', 'Ruby', 'XML', 'Python'];

//   $scope.initializeAceState = function() {
//     if ($scope.currentSnippet){
//       if ($scope.currentSnippet.theme) {
//         $scope.theme = $scope.currentSnippet.theme;
//       }else {
//       $scope.theme = $scope.themes[0];
//       }
//       if ($scope.currentSnippet.tags) {
//         $scope.mode = $scope.currentSnippet.tags[0];
//       }else {
//         $scope.mode = $scope.modes[0];
//       }
//     }else {
//       $scope.theme = $scope.themes[0];
//       $scope.mode = $scope.modes[0];
//     }
//   }

//   $scope.initializeAceState();

//   // $scope.changeAceState = function() {
//   //   if ($scope.currentSnippet.theme)
//   //   $scope.theme = $scope.currentSnippet.theme;
//   //   $scope.mode = $scope.currentSnippet.mode;
//   // };

//   $scope.selectTheme = function(theme) {
//     $scope.theme = theme;
//     if ($scope.currentSnippet) {
//     $scope.currentSnippet.theme = theme;
//     }
//     editor.setTheme("ace/theme/" + theme);
//   };

//   $scope.selectTheme($scope.theme);

//   $scope.aceOption = {
//     mode: $scope.mode.toLowerCase(),
//     onLoad: function (_ace) {
//       $scope.modeChanged = function (mode) {
//         $scope.mode = mode;
//         $scope.currentSnippet.tags[0] = mode;
//         _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
//       };

//     }
//   };

//   $scope.formatFileName = function(str){
//     function toTitleCase(str) {
//       return str.replace(/\w\S*/g, function(txt){
//           return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         }
//       );
//     }

//     function subUnderScoresForSpaces(str) {
//       return str.replace(/_/g, " ");
//     }

//     return toTitleCase(subUnderScoresForSpaces(str));

//   };

//   var session = editor.getSession();
//   session.setUseWrapMode(true);
//   session.setWrapLimitRange(80,80);
// }]);



