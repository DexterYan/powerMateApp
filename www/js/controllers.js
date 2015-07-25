angular.module('starter.controllers', ['starter.services'])


.controller('DashCtrl', function($scope, socket) {
  $scope.addMsg = function(data) {
   socket.connect()
  }

})

.directive('keypadButton', [ 'keypad', 'socket', function(keypad, socket) {
  return {
    restrict: 'E',
    templateUrl: 'templates/elements/button.html',
    link: function(scope, element, attrs) {
      element.on('click', function(){
        var sendData; 
        sendData = keypad.keypadNumberPrefix[0] + attrs.type.toUpperCase();
        socket.send(sendData);
      });

      element.on('release', function(){
        sendData = keypad.keypadNumberPrefix[0] + attrs.type.toLowerCase();
        socket.send(sendData);
      });
    }
  }
}]);

