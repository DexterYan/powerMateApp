angular.module('starter.controllers', ['starter.services'])


.controller('DashCtrl', function($scope, socket) {
  $scope.addMsg = function(data) {
   socket.connect()
  }

})

.directive('keypadButton', [ 'keypad', function(keypad) {
  return {
    restrict: 'E',
    templateUrl: 'templates/elements/button.html',
    link: function(scope, element, attr) {
      scope.sendClickMsg = function() {
        var sendData = keypad.keypadNumberPrefix[$rootScope.currentKeypad] + attr.type.toUpperCase();
        socket.send(sendData);
      };
      scope.sendReleaseMsg = function() {
        var sendData = keypad.keypadNumberPrefix[$rootScope.currentKeypad] + attr.type.toLowerCase();
        socket.send(sendData);
      }
    }
  }
}]);

