angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', function($rootScope, $scope, socket) {
    $scope.addMsg = function(data) {
        socket.connect()
    }
})

.directive('keypadButton', ['keypad', 'socket', '$ionicGesture', function(keypad, socket, $ionicGesture, $timeout) {
        return {
            restrict: 'E',
            templateUrl: 'templates/elements/button.html',
            scope: {
                info: '='
            },
            link: function(scope, element, attrs) {
                scope.handler =function() {
            scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
            scope.$apply();
        }
                // element.on('click', function() {
                //     scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                //     scope.$apply();
                // });
                // $ionicGesture.on('touch', function(e){
                //     scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                //     scope.$apply();
                // }, element);

                // $ionicGesture.on('transform', function(e){
                //     scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                //     scope.$apply();
                // }, element);

                // $ionicGesture.on('release', function(e){
                //     scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                //     scope.$apply();
                // }, element);
                // scope.onTouch = function() {
                //     var sendData;
                //     sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toUpperCase();
                //     socket.send(sendData);
                // };

                // scope.onRelease =  function() {
                //     var sendData;
                //     sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toLowerCase();
                //    socket.send(sendData);
                // };
            }
        }
    }
])

.directive('multitouch', function () {
    return function(scope, element, attr) {
        element.on('touchstart', function() {
            scope.$apply(function() {
                scope.$eval(attr.multitouch);
            });
        });

        scope.handler =function() {
            scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
            scope.$apply();
        }
    };
});