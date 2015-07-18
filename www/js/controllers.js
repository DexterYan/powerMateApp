angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope, socketTest) {

})

.directive('keypadButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/elements/button.html',
    link: function(scope, elem, attr) {
        
    }
  }
});