angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope, socket) {
  $scope.addMsg = function(data) {
   socket.connect()
  }

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.directive('keypadButton', ['socket', function(socket) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      scope.sendClickMsg = function(data) {
        socket.send(data);
      };
      scope.sendReleaseMsg = function(data) {
        socket.send(data);
      }
    }
  }
}]);
