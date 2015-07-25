angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope, socketTest) {

})

.directive('keypadButton', function($rootScope) {
  return {
    restrict: 'E',
    scope: {
      info: '=',
      color1: '=',
      color2: '='
    },
    templateUrl: 'templates/elements/button.html'
  }
});